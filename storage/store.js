const prefix = "dexieos:";
export const read = (key, fallback) => { try { const value = localStorage.getItem(prefix + key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
export const write = (key, value) => localStorage.setItem(prefix + key, JSON.stringify(value));
export const remove = key => localStorage.removeItem(prefix + key);
export const reset = () => Object.keys(localStorage).filter(key => key.startsWith(prefix)).forEach(key => localStorage.removeItem(key));
