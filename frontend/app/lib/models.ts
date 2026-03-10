export let DEFAULT_MODEL = "openai/gpt-oss-120b";

let STORAGE_KEY = "almalex:model";

export let models = [
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" },
  { id: "Qwen/Qwen3-VL-235B-A22B-Instruct", name: "Qwen3 VL 235B" },
  { id: "Llama-3.3-70B-it", name: "Llama 3.3" },
  { id: "Apertus-70B-Instruct-2509", name: "Apertus 70B" },
  { id: "Mistral-Small-3.2-24B-Instruct-2506", name: "Mistral Small 3.2" },
];

export function getStoredModel(): string {
  let stored = localStorage.getItem(STORAGE_KEY);
  if (stored && models.some((m) => m.id === stored)) return stored;
  return DEFAULT_MODEL;
}

export function storeModel(model: string) {
  localStorage.setItem(STORAGE_KEY, model);
}
