export interface PasswordChecks {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  match: boolean;
}

export const PASSWORD_RULES: {
  key: "minLength" | "uppercase" | "lowercase" | "number" | "special";
  label: string;
}[] = [
  { key: "minLength", label: "8 karakter" },
  { key: "uppercase", label: "büyük harf" },
  { key: "lowercase", label: "küçük harf" },
  { key: "number", label: "rakam" },
  { key: "special", label: "işaret (-, ! …)" },
];

export function getPasswordChecks(
  password: string,
  confirmPassword: string
): PasswordChecks {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^\sA-Za-z0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };
}

export function confirmDifference(
  password: string,
  confirmPassword: string
): { ok: boolean; text: string } | null {
  if (!confirmPassword) return null;
  if (password === confirmPassword) return { ok: true, text: "Şifreler eşit" };
  if (password.startsWith(confirmPassword)) {
    const missing = password.length - confirmPassword.length;
    return { ok: false, text: `${missing} karakter eksik` };
  }
  if (password && confirmPassword.startsWith(password)) {
    const extra = confirmPassword.length - password.length;
    return { ok: false, text: `${extra} karakter fazla` };
  }
  return { ok: false, text: "Şifreler eşit değil" };
}

export function isPasswordValid(checks: PasswordChecks): boolean {
  return (
    checks.minLength &&
    checks.uppercase &&
    checks.lowercase &&
    checks.number &&
    checks.special &&
    checks.match
  );
}

export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
