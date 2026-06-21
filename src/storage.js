export function loadFromStorage(key, fallback) {
  const storage = getLocalStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const storedValue = storage.getItem(key);

    if (storedValue === null) {
      return fallback;
    }

    return JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, data) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(data));
}

function getLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}
