export function formatPriceCents(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(priceCents / 100);
}

function hasOnlyDigitsAndSeparators(value: string) {
  return /^[\d.,]+$/.test(value);
}

function buildPriceCentsFromParts(integerPart: string, decimalPart = "") {
  const normalizedInteger = integerPart.replace(/^0+(?=\d)/, "") || "0";
  const normalizedDecimal = decimalPart.padEnd(2, "0").slice(0, 2);
  const combinedValue = `${normalizedInteger}${normalizedDecimal}`;
  const priceCents = Number(combinedValue);

  if (!Number.isSafeInteger(priceCents)) {
    return null;
  }

  return priceCents;
}

function parseWithSingleSeparator(value: string, separator: "," | ".") {
  const parts = value.split(separator);

  if (parts.some((part) => part.length === 0)) {
    return null;
  }

  if (parts.length === 1) {
    return buildPriceCentsFromParts(parts[0]);
  }

  if (parts.length === 2 && parts[1].length === 3) {
    return null;
  }

  const lastPart = parts.at(-1) ?? "";
  const leadingParts = parts.slice(0, -1);

  if (
    lastPart.length <= 2 &&
    leadingParts.every((part, index) => index === 0 || part.length === 3)
  ) {
    return buildPriceCentsFromParts(leadingParts.join(""), lastPart);
  }

  if (
    lastPart.length === 3 &&
    leadingParts.every((part, index) => index === 0 || part.length === 3)
  ) {
    return buildPriceCentsFromParts(parts.join(""));
  }

  return null;
}

function parseNormalizedPriceToCents(value: string) {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma === -1 && lastDot === -1) {
    return buildPriceCentsFromParts(value);
  }

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalIndex = Math.max(lastComma, lastDot);
    const integerPart = value.slice(0, decimalIndex).replace(/[.,]/g, "");
    const decimalPart = value.slice(decimalIndex + 1);

    if (!integerPart || !decimalPart || decimalPart.length > 2) {
      return null;
    }

    return buildPriceCentsFromParts(integerPart, decimalPart);
  }

  return parseWithSingleSeparator(value, lastComma !== -1 ? "," : ".");
}

export function parsePriceInput(value: string) {
  const normalizedValue = value
    .trim()
    .replace(/\s/g, "")
    .replace(/^r\$/i, "")
    .trim();

  if (!normalizedValue) {
    return {
      error: "Informe o preço do produto."
    };
  }

  if (normalizedValue.includes("-")) {
    return {
      error: "O preço do produto deve ser maior que zero."
    };
  }

  if (!hasOnlyDigitsAndSeparators(normalizedValue)) {
    return {
      error: "Use um preço válido. Ex.: 49,90"
    };
  }

  const priceCents = parseNormalizedPriceToCents(normalizedValue);

  if (priceCents === null) {
    return {
      error: "Use um preço válido. Ex.: 49,90"
    };
  }

  if (priceCents <= 0) {
    return {
      error: "O preço do produto deve ser maior que zero."
    };
  }

  return {
    priceCents
  };
}
