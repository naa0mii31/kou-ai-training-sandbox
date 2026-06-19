export function createChild({ id, name }) {
  const normalizedId = normalizeId(id, "child id");
  const normalizedName = normalizeName(name, "child name");

  return {
    id: normalizedId,
    name: normalizedName
  };
}

export function createLesson({ id, childId, name }) {
  const normalizedId = normalizeId(id, "lesson id");
  const normalizedChildId = normalizeId(childId, "childId");
  const normalizedName = normalizeName(name, "lesson name");

  return {
    id: normalizedId,
    childId: normalizedChildId,
    name: normalizedName
  };
}

export function addChild(children, childInput) {
  ensureArray(children, "children");

  return [...children, createChild(childInput)];
}

export function addLesson(children, lessons, lessonInput) {
  ensureArray(children, "children");
  ensureArray(lessons, "lessons");

  if (!children.some((child) => child.id === lessonInput.childId)) {
    throw new Error("child does not exist");
  }

  return [...lessons, createLesson(lessonInput)];
}

export function listLessonsForChild(lessons, childId) {
  ensureArray(lessons, "lessons");

  return lessons.filter((lesson) => lesson.childId === childId);
}

function normalizeName(name, fieldName) {
  if (typeof name !== "string") {
    throw new TypeError(`${fieldName} must be a string`);
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error(`${fieldName} is required`);
  }

  return normalizedName;
}

function normalizeId(id, fieldName) {
  if (typeof id !== "string") {
    throw new TypeError(`${fieldName} must be a string`);
  }

  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new Error(`${fieldName} is required`);
  }

  return normalizedId;
}

function ensureArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be an array`);
  }
}
