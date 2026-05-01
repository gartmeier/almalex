export let DEFAULT_MODEL = "google/gemma-4-31B-it";

let STORAGE_KEY = "almalex_model";

export let models = [
  { id: "google/gemma-4-31B-it", name: "Gemma 4" },
  { id: "Qwen/Qwen3.5-122B-A10B-FP8", name: "Qwen 3.5" },
  { id: "mistralai/Ministral-3-14B-Instruct-2512", name: "Ministral 3" },
  { id: "swiss-ai/Apertus-70B-Instruct-2509", name: "Apertus" },
];

export function getStoredModel(): string {
  let stored = localStorage.getItem(STORAGE_KEY);
  if (stored && models.some((m) => m.id === stored)) return stored;
  return DEFAULT_MODEL;
}

export function storeModel(model: string) {
  localStorage.setItem(STORAGE_KEY, model);
}
