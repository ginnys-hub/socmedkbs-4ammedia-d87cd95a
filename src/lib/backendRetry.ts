const TRANSIENT_BACKEND_ERROR_PATTERNS = [
  /schema cache/i,
  /database client error/i,
  /retrying the connection/i,
  /recovery mode/i,
  /not accepting connections/i,
  /connection.*closed/i,
  /failed to fetch/i,
  /networkerror/i,
  /try again/i,
  /service unavailable/i,
];

export type BackendErrorLike = {
  message?: string | null;
  code?: string | null;
  details?: string | null;
  hint?: string | null;
};

export const waitForRetry = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const normalizeBackendError = (error: unknown): BackendErrorLike => {
  if (!error) return {};
  if (typeof error === "object") return error as BackendErrorLike;
  return { message: String(error) };
};

export const isTransientBackendError = (error: unknown) => {
  const normalized = normalizeBackendError(error);
  const message = [normalized.message, normalized.details, normalized.hint]
    .filter(Boolean)
    .join(" ");

  return normalized.code === "PGRST002" || TRANSIENT_BACKEND_ERROR_PATTERNS.some((pattern) => pattern.test(message));
};

export async function runWithBackendRetry<T>(
  request: () => Promise<T>,
  options?: { maxAttempts?: number; baseDelayMs?: number }
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 4;
  const baseDelayMs = options?.baseDelayMs ?? 700;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (!isTransientBackendError(error) || attempt === maxAttempts - 1) throw error;
      await waitForRetry(baseDelayMs * (attempt + 1));
    }
  }

  throw lastError;
}