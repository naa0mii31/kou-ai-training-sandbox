import test from "node:test";
import assert from "node:assert/strict";
import {
  addChild,
  addLesson,
  createChild,
  createLesson,
  listLessonsForChild
} from "../src/lessons.js";

test("createChild returns a Child with trimmed name", () => {
  assert.deepEqual(createChild({ id: "child-1", name: "  長男  " }), {
    id: "child-1",
    name: "長男"
  });
});

test("createLesson returns a Lesson with childId and trimmed name", () => {
  assert.deepEqual(createLesson({
    id: "lesson-1",
    childId: "child-1",
    name: "  水泳  "
  }), {
    id: "lesson-1",
    childId: "child-1",
    name: "水泳"
  });
});

test("addChild appends a child without mutating the current list", () => {
  const children = [{ id: "child-1", name: "長男" }];
  const result = addChild(children, { id: "child-2", name: "長女" });

  assert.deepEqual(children, [{ id: "child-1", name: "長男" }]);
  assert.deepEqual(result, [
    { id: "child-1", name: "長男" },
    { id: "child-2", name: "長女" }
  ]);
});

test("addLesson appends a lesson for an existing child without mutating the current list", () => {
  const children = [{ id: "child-1", name: "長男" }];
  const lessons = [{ id: "lesson-1", childId: "child-1", name: "水泳" }];
  const result = addLesson(children, lessons, {
    id: "lesson-2",
    childId: "child-1",
    name: "ピアノ"
  });

  assert.deepEqual(lessons, [{ id: "lesson-1", childId: "child-1", name: "水泳" }]);
  assert.deepEqual(result, [
    { id: "lesson-1", childId: "child-1", name: "水泳" },
    { id: "lesson-2", childId: "child-1", name: "ピアノ" }
  ]);
});

test("listLessonsForChild returns only lessons for the selected child", () => {
  const lessons = [
    { id: "lesson-1", childId: "child-1", name: "水泳" },
    { id: "lesson-2", childId: "child-2", name: "ピアノ" },
    { id: "lesson-3", childId: "child-1", name: "学研" }
  ];

  assert.deepEqual(
    listLessonsForChild(lessons, "child-1").map((lesson) => lesson.name),
    ["水泳", "学研"]
  );
});

test("createChild requires a name", () => {
  assert.throws(() => createChild({ id: "child-1", name: " " }), /child name is required/);
});

test("addLesson requires an existing child", () => {
  assert.throws(
    () => addLesson([], [], { id: "lesson-1", childId: "missing", name: "水泳" }),
    /child does not exist/
  );
});
