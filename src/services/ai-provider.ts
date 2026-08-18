/**
 * Provider-neutral contract for Cubic AI's future legal AI integrations.
 *
 * The UI and domain services should depend on this contract instead of a
 * vendor SDK. A provider implementation can be registered later without
 * changing conversation components or the legal workspace model.
 */

export type AiProviderId = string;

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiGenerationRequest {
  messages: AiMessage[];
  conversationId?: string;
  caseId?: string;
  sourceIds?: string[];
  metadata?: Record<string, string>;
}

export interface AiCitation {
  sourceId: string;
  label: string;
  locator?: string;
  url?: string;
}

export interface AiGenerationResponse {
  text: string;
  citations: AiCitation[];
  provider: AiProviderId;
  model?: string;
  runId?: string;
}

export interface AiProvider {
  readonly id: AiProviderId;
  generate(request: AiGenerationRequest): Promise<AiGenerationResponse>;
}

export class AiProviderNotConfiguredError extends Error {
  constructor() {
    super(
      "Nenhum provedor de IA foi configurado. Configure uma implementação server-side antes de executar uma geração.",
    );
    this.name = "AiProviderNotConfiguredError";
  }
}

const unconfiguredProvider: AiProvider = {
  id: "unconfigured",
  async generate() {
    throw new AiProviderNotConfiguredError();
  },
};

const providers = new Map<AiProviderId, AiProvider>();

export function registerAiProvider(provider: AiProvider): void {
  providers.set(provider.id, provider);
}

export function getAiProvider(providerId = "unconfigured"): AiProvider {
  return providers.get(providerId) ?? unconfiguredProvider;
}

export function getConfiguredAiProviderId(): AiProviderId {
  return import.meta.env.VITE_AI_PROVIDER?.trim() || "unconfigured";
}

export function getActiveAiProvider(): AiProvider {
  return getAiProvider(getConfiguredAiProviderId());
}
