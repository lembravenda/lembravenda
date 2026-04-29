export function formatPriceCents(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(priceCents / 100);
}

export function parsePriceInput(value: string) {
  const normalizedValue = value.trim().replace(/\s/g, "");

  if (!normalizedValue) {
    return {
      error: "Informe o preco do produto."
    };
  }

  const sanitizedValue = normalizedValue
    .replace(/^r\$/i, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {
    return {
      error: "Informe um preco valido."
    };
  }

  const numericValue = Number(sanitizedValue);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return {
      error: "O preco nao pode ser negativo."
    };
  }

  return {
    priceCents: Math.round(numericValue * 100)
  };
}
