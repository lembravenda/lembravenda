import { expect, test, type Page } from "@playwright/test";

async function createAccountAndCompleteOnboarding(
  page: Page,
  suffix: string,
  options?: {
    brandName?: string;
    phone?: string;
    pixKey?: string;
    primaryCategory?: string;
  }
) {
  const email = `${suffix}-${Date.now()}@exemplo.com`;

  await page.goto("/login");
  await page.getByRole("textbox", { name: "E-mail" }).nth(1).fill(email);
  await page.getByLabel("Senha").nth(1).fill("123456");
  await page.getByRole("button", { name: "Criar conta" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("Nome da revendedora").fill(`Usuária ${suffix}`);

  if (options?.brandName) {
    await page.getByLabel("Nome do negócio").fill(options.brandName);
  }

  if (options?.phone) {
    await page.getByLabel("Telefone").fill(options.phone);
  }

  if (options?.pixKey) {
    await page.getByLabel("Chave Pix").fill(options.pixKey);
  }

  await page
    .getByLabel("Categoria principal")
    .fill(options?.primaryCategory ?? "Cosméticos");
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page).toHaveURL(/\/app\/hoje$/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Vamos organizar sua primeira venda?"
    })
  ).toBeVisible();
}

async function createCustomerFromApp(
  page: Page,
  name: string,
  options?: {
    birthday?: string;
    notes?: string;
    phone?: string;
    tags?: string;
  }
) {
  await page.goto("/app/clientes?mode=new");
  await page.getByLabel("Nome").fill(name);

  if (options?.phone) {
    await page.getByLabel("Telefone").fill(options.phone);
  }

  if (options?.birthday) {
    await page.getByLabel("Aniversário").fill(options.birthday);
  }

  if (options?.tags) {
    await page.getByLabel("Grupos da cliente").fill(options.tags);
  }

  if (options?.notes) {
    await page.getByLabel("Observações").fill(options.notes);
  }

  await page.getByRole("button", { name: "Salvar cliente" }).click();
  await expect(page).toHaveURL(/\/app\/clientes$/);
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

async function createProductFromApp(
  page: Page,
  name: string,
  options?: {
    category?: string;
    price?: string;
    repurchaseDays?: string;
  }
) {
  await page.goto("/app/produtos?mode=new");
  await page.getByLabel("Nome").fill(name);
  await page.getByLabel("Preço").fill(options?.price ?? "19,90");

  if (options?.category) {
    await page.getByLabel("Categoria").fill(options.category);
  }

  if (options?.repurchaseDays) {
    await page
      .getByLabel("Quando lembrar de vender de novo?")
      .fill(options.repurchaseDays);
  }

  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(page).toHaveURL(/\/app\/produtos$/);
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

async function createOrderFromApp(page: Page, quantity = "1") {
  await page.goto("/app/pedidos?mode=new");
  await page.getByRole("button", { name: "Adicionar" }).click();
  await page.getByLabel("Quantidade").fill(quantity);
  await page.getByRole("button", { name: "Salvar pedido" }).click();
  await expect(page).toHaveURL(/\/app\/pedidos\/.+$/);
}

async function backdateCurrentOrder(page: Page, daysAgo: number) {
  const currentUrl = new URL(page.url());
  const orderId = currentUrl.pathname.split("/").pop();

  if (!orderId) {
    throw new Error("Não foi possível identificar o pedido para backdate.");
  }

  const timestamp = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000
  ).toISOString();
  const cookies = await page.context().cookies(currentUrl.origin);
  const ordersCookie = cookies.find(
    (cookie) => cookie.name === "agenda_test_orders"
  );
  const orderItemsCookie = cookies.find(
    (cookie) => cookie.name === "agenda_test_order_items"
  );

  if (!ordersCookie || !orderItemsCookie) {
    throw new Error("Cookies de teste do pedido não encontrados.");
  }

  const orders = JSON.parse(ordersCookie.value) as Array<
    Record<string, string>
  >;
  const orderItems = JSON.parse(orderItemsCookie.value) as Array<
    Record<string, string>
  >;
  const nextOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          created_at: timestamp,
          updated_at: timestamp
        }
      : order
  );
  const nextOrderItems = orderItems.map((orderItem) =>
    orderItem.order_id === orderId
      ? {
          ...orderItem,
          created_at: timestamp,
          updated_at: timestamp
        }
      : orderItem
  );

  await page.context().addCookies([
    {
      domain: currentUrl.hostname,
      httpOnly: true,
      name: "agenda_test_orders",
      path: "/",
      sameSite: "Lax",
      value: JSON.stringify(nextOrders)
    },
    {
      domain: currentUrl.hostname,
      httpOnly: true,
      name: "agenda_test_order_items",
      path: "/",
      sameSite: "Lax",
      value: JSON.stringify(nextOrderItems)
    }
  ]);
}

function getSectionByLabel(page: Page, label: string) {
  return page.locator("section[aria-label]").filter({ hasText: label }).first();
}

test("home carrega a base técnica do MVP", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Lembre quem cobrar, entregar e chamar para comprar de novo."
    })
  ).toBeVisible();
  await expect(
    page.getByText(
      "O LembraVenda ajuda quem vende pelo WhatsApp a organizar clientes, pedidos, cobranças e recompras em poucos minutos."
    )
  ).toBeVisible();
});

test("rota protegida redireciona para login sem sessão", async ({ page }) => {
  await page.goto("/app/hoje");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Entre na sua agenda" })
  ).toBeVisible();
});

test("onboarding exige sessão", async ({ page }) => {
  await page.goto("/onboarding");

  await expect(page).toHaveURL(/\/login$/);
});

test("onboarding salva perfil", async ({ page }) => {
  await page.goto("/login");

  const email = `teste-${Date.now()}@exemplo.com`;

  await page.getByRole("textbox", { name: "E-mail" }).nth(1).fill(email);
  await page.getByLabel("Senha").nth(1).fill("123456");
  await page.getByRole("button", { name: "Criar conta" }).click();

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("Nome da revendedora").fill("Maria Revendedora");
  await page.getByLabel("Nome do negócio").fill("Loja da Maria");
  await page.getByLabel("Telefone").fill("(11) 99999-9999");
  await page.getByLabel("Chave Pix").fill("maria@pix.com");
  await page.getByLabel("Categoria principal").fill("Cosméticos");
  await page.getByRole("button", { name: "Salvar e continuar" }).click();

  await expect(page).toHaveURL(/\/app\/hoje$/);
  await expect(
    page.getByRole("heading", { exact: true, name: "Hoje" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Vamos organizar sua primeira venda?"
    })
  ).toBeVisible();
});

test("login redireciona usuária autenticada para onboarding", async ({
  page
}) => {
  await page.goto("/login");

  const email = `redireciona-${Date.now()}@exemplo.com`;

  await page.getByRole("textbox", { name: "E-mail" }).nth(1).fill(email);
  await page.getByLabel("Senha").nth(1).fill("123456");
  await page.getByRole("button", { name: "Criar conta" }).click();

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.goto("/login");
  await expect(page).toHaveURL(/\/onboarding$/);
});

test("logout funciona", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "saida");
  await page.getByRole("button", { name: "Sair" }).click();

  await expect(page).toHaveURL(/\/login$/);
});

test("criar e listar cliente", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "clientes-criar");

  await createCustomerFromApp(page, "Carla Souza", {
    birthday: "1992-08-15",
    notes: "Prefere contato no fim do dia.",
    phone: "(11) 98888-7777",
    tags: "vip, recorrente"
  });

  await expect(page).toHaveURL(/\/app\/clientes$/);
  await expect(
    page.getByRole("heading", { name: "Carla Souza" })
  ).toBeVisible();
  await expect(page.getByText("(11) 98888-7777")).toBeVisible();
  await expect(page.getByText("vip, recorrente")).toBeVisible();
});

test("editar cliente", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "clientes-editar");

  await createCustomerFromApp(page, "Renata Lima");
  await page.getByRole("link", { name: "Editar" }).click();
  await page.getByLabel("Telefone").fill("(21) 97777-1111");
  await page.getByLabel("Grupos da cliente").fill("atacado");
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page).toHaveURL(/\/app\/clientes$/);
  await expect(page.getByText("(21) 97777-1111")).toBeVisible();
  await expect(page.getByText("atacado")).toBeVisible();
});

test("excluir cliente", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "clientes-excluir");

  await createCustomerFromApp(page, "Beatriz Costa");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Excluir" }).click();

  await expect(page.getByText("Beatriz Costa")).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Adicionar primeira cliente" })
  ).toBeVisible();
});

test("usuária não acessa dados de outra usuária", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "clientes-a");

  await createCustomerFromApp(page, "Cliente Privada");
  await expect(page.getByText("Cliente Privada")).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await createAccountAndCompleteOnboarding(page, "clientes-b");
  await page.goto("/app/clientes");

  await expect(page.getByText("Cliente Privada")).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Adicionar primeira cliente" })
  ).toBeVisible();
});

test("criar e listar produto", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "produtos-criar");

  await createProductFromApp(page, "Kit Batom Matte", {
    category: "Maquiagem",
    price: "39,90",
    repurchaseDays: "45"
  });

  await expect(page).toHaveURL(/\/app\/produtos$/);
  await expect(
    page.getByRole("heading", { name: "Kit Batom Matte" })
  ).toBeVisible();
  await expect(page.getByText("R$ 39,90")).toBeVisible();
  await expect(page.getByText("Maquiagem")).toBeVisible();
});

test("editar produto", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "produtos-editar");

  await createProductFromApp(page, "Serum Facial", {
    price: "59,90"
  });
  await page.getByRole("link", { name: "Editar" }).click();
  await page.getByLabel("Categoria").fill("Skincare");
  await page.getByLabel("Quando lembrar de vender de novo?").fill("30");
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page.getByText("Skincare")).toBeVisible();
  await expect(page.getByText("30 dias")).toBeVisible();
});

test("inativar produto", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "produtos-inativar");

  await createProductFromApp(page, "Hidratante Corporal", {
    price: "24,90"
  });

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Inativar" }).click();

  await expect(page.getByText("Inativo")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Inativar" })
  ).not.toBeVisible();
});

test("usuária não acessa produtos de outra usuária", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "produtos-a");

  await createProductFromApp(page, "Produto Privado", {
    price: "19,90"
  });
  await expect(page.getByText("Produto Privado")).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await createAccountAndCompleteOnboarding(page, "produtos-b");
  await page.goto("/app/produtos");

  await expect(page.getByText("Produto Privado")).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Adicionar primeiro produto" })
  ).toBeVisible();
});

test("criar pedido e listar pedido", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "pedidos-criar");
  await createCustomerFromApp(page, "Amanda Cliente");
  await createProductFromApp(page, "Base Liquida", {
    price: "49,90"
  });

  await createOrderFromApp(page, "2");
  await expect(
    page.getByRole("heading", { name: "Amanda Cliente" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Base Liquida" })
  ).toBeVisible();
  await expect(page.getByRole("article").getByText("R$ 99,80")).toBeVisible();

  await page.goto("/app/pedidos");
  await expect(page.getByText("Amanda Cliente")).toBeVisible();
  await expect(page.getByRole("link", { name: "Cobrar" })).toBeVisible();
  await page.getByRole("link", { name: "Ver detalhes" }).click();
  await expect(page).toHaveURL(/\/app\/pedidos\/.+$/);
  await expect(page.getByText("Itens do pedido")).toBeVisible();
});

test("marcar pedido como pago", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "pedidos-pago");
  await createCustomerFromApp(page, "Cliente Pago");
  await createProductFromApp(page, "Creme Noturno", {
    price: "29,90"
  });

  await createOrderFromApp(page);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Marcar como pago" }).click();

  await expect(
    page.locator("div").filter({ hasText: /^PagamentoPago$/ })
  ).toBeVisible();
});

test("marcar pedido como entregue", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "pedidos-entregue");
  await createCustomerFromApp(page, "Cliente Entrega");
  await createProductFromApp(page, "Sabonete Facial", {
    price: "19,90"
  });

  await createOrderFromApp(page);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Marcar como entregue" }).click();

  await expect(page.getByText("Entregue")).toBeVisible();
});

test("produto inativo não aparece como opção principal para pedido novo", async ({
  page
}) => {
  await createAccountAndCompleteOnboarding(page, "pedidos-ativos");
  await createCustomerFromApp(page, "Cliente Ativos");
  await createProductFromApp(page, "Perfume Ativo", {
    price: "89,90"
  });
  await createProductFromApp(page, "Produto Inativo", {
    price: "12,90"
  });

  const inactiveProductCard = page
    .locator("article")
    .filter({ hasText: "Produto Inativo" });

  page.once("dialog", (dialog) => dialog.accept());
  await inactiveProductCard.getByRole("button", { name: "Inativar" }).click();
  await expect(
    inactiveProductCard.getByRole("button", { name: "Inativar" })
  ).toHaveCount(0);
  await expect(
    inactiveProductCard.getByText("Inativo", { exact: true })
  ).toBeVisible();

  await page.goto("/app/pedidos?mode=new");
  await page.getByRole("searchbox", { name: "Buscar produto" }).fill("Inativo");
  await expect(
    page.getByRole("button", { name: /Produto Inativo .* Adicionar/i })
  ).toHaveCount(0);
  await expect(
    page.getByText("Nenhum produto ativo encontrado para essa busca.")
  ).toBeVisible();

  await page.getByRole("searchbox", { name: "Buscar produto" }).fill("Perfume");
  await expect(page.getByText("Perfume Ativo")).toBeVisible();
});

test("gera cobranca manual com Pix e link do WhatsApp", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  await createAccountAndCompleteOnboarding(page, "pedidos-cobranca-pix", {
    pixKey: "pix@lojadaana.com"
  });

  await createCustomerFromApp(page, "Ana Cliente", {
    phone: "(11) 99888-7766"
  });
  await createProductFromApp(page, "Batom Cremoso", {
    price: "39,90"
  });
  await createOrderFromApp(page);

  await expect(
    page.getByRole("heading", { name: "Mensagem pronta para WhatsApp" })
  ).toBeVisible();
  await expect(page.getByLabel("Mensagem de cobrança")).toContainText(
    "Ana Cliente"
  );
  await expect(page.getByLabel("Mensagem de cobrança")).toContainText(
    "pix@lojadaana.com"
  );
  await page.getByRole("button", { name: "Copiar mensagem" }).click();
  await expect(page.getByText(/Mensagem copiada\./)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Abrir no WhatsApp" })
  ).toHaveAttribute("href", /https:\/\/wa\.me\/5511998887766\?text=/);
});

test("cliente sem telefone exibe apenas copia de cobranca", async ({
  page
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  await createAccountAndCompleteOnboarding(page, "pedidos-cobranca-sem-fone");
  await createCustomerFromApp(page, "Bruna Sem Fone");
  await createProductFromApp(page, "Creme Corporal", {
    price: "25,90"
  });
  await createOrderFromApp(page);

  await expect(
    page.getByRole("heading", { name: "Mensagem pronta para WhatsApp" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Copiar mensagem" }).click();
  await expect(page.getByText(/Mensagem copiada\./)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Abrir no WhatsApp" })
  ).toHaveCount(0);
  await expect(
    page.getByText(/Cadastre um telefone válido da cliente/)
  ).toBeVisible();
});

test("pedido pendente aparece em Hoje com ação de cobrar", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "hoje-pendente");
  await createCustomerFromApp(page, "Cliente Hoje", {
    phone: "(11) 97777-1111"
  });
  await createProductFromApp(page, "Kit Hoje", {
    price: "49,90"
  });
  await createOrderFromApp(page);

  await page.goto("/app/hoje");

  const chargesSection = getSectionByLabel(page, "Cobranças pendentes");
  const deliveriesSection = getSectionByLabel(page, "Entregas pendentes");
  const recentOrdersSection = getSectionByLabel(page, "Pedidos recentes");

  await expect(chargesSection).toContainText("Cliente Hoje");
  await expect(chargesSection).toContainText("R$ 49,90");
  await expect(
    chargesSection.getByRole("link", { name: "Cobrar" })
  ).toBeVisible();
  await expect(deliveriesSection).toContainText("Cliente Hoje");
  await expect(recentOrdersSection).toContainText("Cliente Hoje");
});

test("pedido pago sai da seção de cobrança em Hoje", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "hoje-pago");
  await createCustomerFromApp(page, "Cliente Pago Hoje");
  await createProductFromApp(page, "Produto Pago Hoje", {
    price: "29,90"
  });
  await createOrderFromApp(page);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Marcar como pago" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^PagamentoPago$/ })
  ).toBeVisible();

  await page.goto("/app/hoje");

  const recentOrdersSection = getSectionByLabel(page, "Pedidos recentes");

  await expect(page.getByRole("link", { name: "Cobrar" })).toHaveCount(0);
  await expect(recentOrdersSection).toContainText("Cliente Pago Hoje");
});

test("pedido entregue sai da seção de entrega em Hoje", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "hoje-entregue");
  await createCustomerFromApp(page, "Cliente Entregue Hoje");
  await createProductFromApp(page, "Produto Entregue Hoje", {
    price: "19,90"
  });
  await createOrderFromApp(page);

  await page.goto("/app/hoje");

  const deliveriesSection = getSectionByLabel(page, "Entregas pendentes");
  await expect(deliveriesSection).toContainText("Cliente Entregue Hoje");

  page.once("dialog", (dialog) => dialog.accept());
  await deliveriesSection
    .getByRole("button", { name: "Marcar entregue" })
    .click();

  await expect(page).toHaveURL(/\/app\/hoje$/);
  await expect(getSectionByLabel(page, "Entregas pendentes")).toHaveCount(0);
});

test("usuária não acessa pedidos de outra usuária", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "pedidos-a");
  await createCustomerFromApp(page, "Cliente Segura");
  await createProductFromApp(page, "Produto Seguro", {
    price: "22,90"
  });

  await createOrderFromApp(page);
  const detailUrl = page.url();
  await expect(
    page.getByRole("heading", { level: 3, name: "Produto Seguro" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await createAccountAndCompleteOnboarding(page, "pedidos-b");
  await page.goto("/app/pedidos");
  await expect(page.getByText("Cliente Segura")).not.toBeVisible();

  await page.goto(detailUrl);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Pedido não encontrado"
    })
  ).toBeVisible();
});

test("usuária não vê dados de outra usuária em Hoje", async ({ page }) => {
  await createAccountAndCompleteOnboarding(page, "hoje-a");
  await createCustomerFromApp(page, "Cliente Privada Hoje");
  await createProductFromApp(page, "Produto Privado Hoje", {
    price: "59,90"
  });
  await createOrderFromApp(page);

  await page.goto("/app/hoje");
  await expect(
    page
      .getByRole("heading", { level: 3, name: "Cliente Privada Hoje" })
      .first()
  ).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await createAccountAndCompleteOnboarding(page, "hoje-b");
  await page.goto("/app/hoje");

  await expect(page.getByText("Cliente Privada Hoje")).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Vamos organizar sua primeira venda?"
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Adicionar cliente" })
  ).toBeVisible();
});

test("mostra oportunidade de recompra, permite copiar e abrir WhatsApp", async ({
  page
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  await createAccountAndCompleteOnboarding(page, "recompra-whatsapp");
  await createCustomerFromApp(page, "Cliente Recompra", {
    phone: "(11) 96666-4444"
  });
  await createProductFromApp(page, "Shampoo Premium", {
    price: "39,90",
    repurchaseDays: "30"
  });
  await createOrderFromApp(page);
  await backdateCurrentOrder(page, 45);

  await page.goto("/app/recompra");

  await expect(
    page.getByRole("heading", { level: 3, name: "Cliente Recompra" })
  ).toBeVisible();
  await expect(page.getByText("Shampoo Premium")).toBeVisible();
  await page.getByRole("button", { name: "Copiar mensagem" }).click();
  await expect(page.getByText("Mensagem copiada.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Abrir no WhatsApp" })
  ).toHaveAttribute("href", /https:\/\/wa\.me\/5511966664444\?text=/);
});

test("marcar recompra como contatada remove a oportunidade", async ({
  page
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  await createAccountAndCompleteOnboarding(page, "recompra-contatada");
  await createCustomerFromApp(page, "Cliente Contatada", {
    phone: "(11) 97777-5555"
  });
  await createProductFromApp(page, "Sabonete Facial", {
    price: "29,90",
    repurchaseDays: "15"
  });
  await createOrderFromApp(page);
  await backdateCurrentOrder(page, 20);

  await page.goto("/app/recompra");
  await expect(
    page.getByRole("heading", { level: 3, name: "Cliente Contatada" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Marcar contatada" }).click();
  await expect(page).toHaveURL(/\/app\/recompra$/);
  await expect(page.getByText("Cliente Contatada")).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("Cliente Contatada")).toHaveCount(0);
});

test("usuária não vê oportunidades de recompra de outra usuária", async ({
  page
}) => {
  await createAccountAndCompleteOnboarding(page, "recompra-a");
  await createCustomerFromApp(page, "Cliente Privada Recompra");
  await createProductFromApp(page, "Creme Renovador", {
    price: "49,90",
    repurchaseDays: "10"
  });
  await createOrderFromApp(page);
  await backdateCurrentOrder(page, 20);

  await page.goto("/app/recompra");
  await expect(page.getByText("Cliente Privada Recompra")).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await createAccountAndCompleteOnboarding(page, "recompra-b");
  await page.goto("/app/recompra");

  await expect(page.getByText("Cliente Privada Recompra")).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Nenhuma recompra por enquanto"
    })
  ).toBeVisible();
});
