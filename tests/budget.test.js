import test from "node:test";
import assert from "node:assert/strict";
import {
  createExpense,
  filterByMonth,
  summarizeByChild,
  totalByChild,
  totalByMonth,
  totalExpenses
} from "../src/budget.js";

const children = [
  { id: "child-1", name: "長男" },
  { id: "child-2", name: "長女" },
  { id: "child-3", name: "次男" }
];

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

test("filterByMonth returns expenses paid in the selected month", () => {
  assert.deepEqual(
    filterByMonth(expenses, "2026-06").map((expense) => expense.id),
    ["1", "2"]
  );
});

test("filterByMonth returns an empty list when the month has no expenses", () => {
  assert.deepEqual(filterByMonth(expenses, "2026-07"), []);
});

test("totalByMonth returns the total for the selected month", () => {
  assert.equal(totalByMonth(expenses, "2026-06"), 2700);
});

test("totalByMonth returns 0 when the month has no expenses", () => {
  assert.equal(totalByMonth(expenses, "2026-07"), 0);
});

test("totalByChild returns the total for the selected child", () => {
  assert.equal(totalByChild(expenses, "child-1"), 2700);
});

test("totalByChild returns 0 when the child has no expenses", () => {
  assert.equal(totalByChild(expenses, "child-3"), 0);
});

test("summarizeByChild returns totals for each child", () => {
  assert.deepEqual(summarizeByChild(expenses, children), {
    "child-1": 2700,
    "child-2": 420,
    "child-3": 0
  });
});
