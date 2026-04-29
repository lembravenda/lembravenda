/**
 * Utilitários de validação e normalização de telefone brasileiro.
 * Pode ser usado em client e server components.
 */

/** Remove tudo que não for dígito. */
export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normaliza telefone: remove não-dígitos, remove 0 inicial, remove DDI 55. */
export function normalizePhone(raw: string): string {
  let digits = stripNonDigits(raw).replace(/^0+/, "");
  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }
  return digits;
}

/** Valida telefone brasileiro: 10 ou 11 dígitos. Vazio é válido (campo opcional). */
export function validatePhone(raw: string): "valid" | "invalid" | "empty" {
  const digits = normalizePhone(raw);
  if (digits.length === 0) return "empty";
  if (digits.length === 10 || digits.length === 11) return "valid";
  return "invalid";
}
