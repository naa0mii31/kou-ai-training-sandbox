import test from "node:test";
import assert from "node:assert/strict";
import {
  loadFromStorage,
  saveToStorage
} from "../src/storage.js";

test("loadFromStorage returns fallback when localStorage is not available", () => {
  delete global.window;

  assert.deepEqual(loadFromStorage("missing", []), []);
});

test("loadFromStorage returns fallback when key is empty", () => {
  mockWindowStorage();

  assert.deepEqual(loadFromStorage("missing", ["fallback"]), ["fallback"]);
});

test("saveToStorage saves JSON and loadFromStorage reads it", () => {
  const storage = mockWindowStorage();
  const children = [{ id: "child-1", name: "長男" }];

  saveToStorage("narajigo:children", children);

  assert.equal(storage.getItem("narajigo:children"), JSON.stringify(children));
  assert.deepEqual(loadFromStorage("narajigo:children", []), children);
});

test("loadFromStorage returns fallback when JSON is broken", () => {
  const storage = mockWindowStorage();
  storage.setItem("narajigo:children", "{broken");

  assert.deepEqual(loadFromStorage("narajigo:children", []), []);
});

function mockWindowStorage() {
  const values = new Map();
  const storage = {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    }
  };

  global.window = { localStorage: storage };

  return storage;
}
