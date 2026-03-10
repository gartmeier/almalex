export let DEFAULT_MODEL = "openai/gpt-oss-120b";

let STORAGE_KEY = "almalex:model";

export let models = [
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" },
  { id: "qwen3", name: "Qwen3" },
  { id: "llama3", name: "Llama 3.3" },
  { id: "swiss-ai/Apertus-70B-Instruct-2509", name: "Apertus 70B" },
  { id: "mistral3", name: "Mistral Small 3.2" },
];

export function getStoredModel(): string {
  let stored = localStorage.getItem(STORAGE_KEY);
  if (stored && models.some((m) => m.id === stored)) return stored;
  return DEFAULT_MODEL;
}

export function storeModel(model: string) {
  localStorage.setItem(STORAGE_KEY, model);
}
