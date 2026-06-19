import test from "node:test";
import assert from "node:assert/strict";
import {
  createExpense,
  totalExpenses
} from "../src/budget.js";

const expenses = [
  { id: "1", childId: "child-1", lessonId: "lesson-1", amount: 900, paidAt: "2026-06-01" },
  { id: "2", childId: "child-1", lessonId: "lesson-2", amount: 1800, paidAt: "2026-06-02" },
  { id: "3", childId: "child-2", lessonId: "lesson-3", amount: 420, paidAt: "2026-05-30" }
];

test("createExpense returns a child and lesson based expense", () => {
  assert.deepEqual(createExpense({
    id: "expense-test",
    childId: "  child-1  ",
    lessonId: "  lesson-1  ",
    amount: "380.4",
    paidAt: "  2026-06-02  ",
    note: "  チケット5回  "
  }), {
    id: "expense-test",
    childId: "child-1",
    lessonId: "lesson-1",
    amount: 380,
    paidAt: "2026-06-02",
    note: "チケット5回"
  });
});

test("createExpense allows an empty note", () => {
  assert.equal(createExpense({
    id: "expense-test",
    childId: "child-1",
    lessonId: "lesson-1",
    amount: 1000,
    paidAt: "2026-06-02"
  }).note, "");
});

test("createExpense requires childId", () => {
  assert.throws(() => createExpense({
    id: "expense-test",
    childId: "",
    lessonId: "lesson-1",
    amount: 1000,
    paidAt: "2026-06-02"
  }), /childId is required/);
});

test("createExpense requires lessonId", () => {
  assert.throws(() => createExpense({
    id: "expense-test",
    childId: "child-1",
    lessonId: "",
    amount: 1000,
    paidAt: "2026-06-02"
  }), /lessonId is required/);
});

test("createExpense requires paidAt", () => {
  assert.throws(() => createExpense({
    id: "expense-test",
    childId: "child-1",
    lessonId: "lesson-1",
    amount: 1000,
    paidAt: ""
  }), /paidAt is required/);
});

test("totalExpenses returns the sum of amounts", () => {
  assert.equal(totalExpenses(expenses), 3120);
});
