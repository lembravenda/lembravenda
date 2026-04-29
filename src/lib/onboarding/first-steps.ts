export type FirstStepsInput = {
  hasCustomer: boolean;
  hasOrder: boolean;
  hasProduct: boolean;
};

export type FirstStep = {
  ctaHref: string | null;
  ctaLabel: string | null;
  done: boolean;
  key: "customer" | "product" | "order" | "return";
  title: string;
};

export type FirstStepsState = {
  allDone: boolean;
  intro: string;
  steps: FirstStep[];
};

export function buildFirstStepsState(input: FirstStepsInput): FirstStepsState {
  const steps: FirstStep[] = [
    {
      ctaHref: input.hasCustomer ? null : "/app/clientes?mode=new#nova-cliente",
      ctaLabel: input.hasCustomer ? null : "Adicionar cliente",
      done: input.hasCustomer,
      key: "customer",
      title: "1. Cadastre sua primeira cliente"
    },
    {
      ctaHref: input.hasProduct ? null : "/app/produtos?mode=new#novo-produto",
      ctaLabel: input.hasProduct ? null : "Adicionar produto",
      done: input.hasProduct,
      key: "product",
      title: "2. Cadastre seu primeiro produto"
    },
    {
      ctaHref: input.hasOrder ? null : "/app/pedidos?mode=new#novo-pedido",
      ctaLabel: input.hasOrder ? null : "Criar pedido",
      done: input.hasOrder,
      key: "order",
      title: "3. Crie seu primeiro pedido"
    },
    {
      ctaHref: null,
      ctaLabel: null,
      done: input.hasOrder,
      key: "return",
      title: "4. Depois volte aqui para ver cobranças, entregas e recompras"
    }
  ];

  let intro = "Comece cadastrando sua primeira cliente.";

  if (input.hasCustomer && !input.hasProduct) {
    intro = "Boa. Agora cadastre seu primeiro produto.";
  } else if (input.hasCustomer && input.hasProduct && !input.hasOrder) {
    intro = "Tudo certo para criar seu primeiro pedido.";
  } else if (input.hasOrder) {
    intro = "Seu começo já está montado. Agora esta tela vai te ajudar no dia.";
  }

  return {
    allDone: steps.every((step) => step.done),
    intro,
    steps
  };
}
