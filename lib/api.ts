export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `tgs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface ApiSubmitResult {
  ok: boolean;
  error?: string;
  redirectUrl?: string;
}

const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. Please try again or reach us at techgirlssquad@tech4dev.com";

export async function postJson<T extends Record<string, unknown>>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data: (T & { error?: string }) | undefined;
    try {
      data = (await response.json()) as T & { error?: string };
    } catch {
      data = undefined;
    }

    if (!response.ok) {
      return {
        ok: false,
        error: data?.error || DEFAULT_ERROR_MESSAGE,
      };
    }

    return { ok: true, data };
  } catch (err) {
    console.error(`Request to ${endpoint} failed:`, err);
    return { ok: false, error: DEFAULT_ERROR_MESSAGE };
  }
}

export async function initializePayment(
  payload: Record<string, unknown>
): Promise<ApiSubmitResult> {
  const res = await postJson<{
    success?: boolean;
    authorization_url?: string;
    reference?: string;
  }>("/api/payments/initialize", payload);

  if (!res.ok) {
    return { ok: false, error: res.error };
  }

  if (!res.data?.authorization_url) {
    return {
      ok: false,
      error: "Payment could not be started. Please try again.",
    };
  }

  return { ok: true, redirectUrl: res.data.authorization_url };
}
