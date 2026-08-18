export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface SupabaseRestClient {
  request<T>(table: string, options?: SupabaseRequestOptions): Promise<T>;
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "O Supabase ainda não foi configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar a persistência.",
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

function readPublicConfig(): SupabasePublicConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), anonKey };
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  return readPublicConfig();
}

export function isSupabaseConfigured(): boolean {
  return readPublicConfig() !== null;
}

/**
 * Minimal REST transport seam. Domain repositories should wrap this client;
 * components must not compose table names, filters, or database headers.
 *
 * Only the public anon key is accepted here. Service-role credentials must
 * never be exposed to Vite or browser bundles and belong in a server-side
 * Vercel function when that layer is added.
 */
export function createSupabaseRestClient(
  config = readPublicConfig(),
): SupabaseRestClient {
  if (!config) {
    return {
      async request() {
        throw new SupabaseNotConfiguredError();
      },
    };
  }

  return {
    async request<T>(
      table: string,
      options: SupabaseRequestOptions = {},
    ): Promise<T> {
      const { method = "GET", query = "", body, headers = {} } = options;
      const response = await fetch(
        `${config.url}/rest/v1/${encodeURIComponent(table)}${query}`,
        {
          method,
          headers: {
            apikey: config.anonKey,
            Authorization: `Bearer ${config.anonKey}`,
            Accept: "application/json",
            ...(body === undefined
              ? {}
              : { "Content-Type": "application/json" }),
            ...headers,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(
          `Supabase request failed (${response.status}): ${detail || response.statusText}`,
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    },
  };
}
