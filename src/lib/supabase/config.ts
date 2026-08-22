export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isEncryptionConfigured(): boolean {
  return Boolean(process.env.FILINGS_ENCRYPTION_KEY);
}

/** Throws with a clear message rather than silently encrypting with `undefined`. */
export function requireEncryptionKey(): string {
  const key = process.env.FILINGS_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "FILINGS_ENCRYPTION_KEY is not set — cannot save or read encrypted filings.",
    );
  }
  return key;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
