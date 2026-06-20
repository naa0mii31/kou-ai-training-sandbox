export function normalizeAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }
  return Math.round(amount);
}

export function createExpense(input) {
  const id = normalizeRequiredString(input.id, "id");
  const childId = normalizeRequiredString(input.childId, "childId");
  const lessonId = normalizeRequiredString(input.lessonId, "lessonId");
  const paidAt = normalizePaidAt(input.paidAt);

  return {
    id,
    childId,
    lessonId,
    amount: normalizeAmount(input.amount),
    paidAt,
    note: String(input.note || "").trim()
  };
}

export function totalExpenses(expenses) {
  return expenses.reduce((sum, expense) => sum + normalizeAmount(expense.amount), 0);
}

export function filterByMonth(expenses, month) {
  const normalizedMonth = String(month || "").trim();

  return expenses.filter((expense) => String(expense.paidAt || "").slice(0, 7) === normalizedMonth);
}

export function totalByMonth(expenses, month) {
  return totalExpenses(filterByMonth(expenses, month));
}

export function totalByChild(expenses, childId) {
  return totalExpenses(expenses.filter((expense) => expense.childId === childId));
}

export function summarizeByChild(expenses, children) {
  return children.reduce((summary, child) => ({
    ...summary,
    [child.id]: totalByChild(expenses, child.id)
  }), {});
}

function normalizeRequiredString(value, fieldName) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`);
  }

  return normalizedValue;
}

function normalizePaidAt(value) {
  const paidAt = normalizeRequiredString(value, "paidAt");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(paidAt)) {
    throw new Error("paidAt must be YYYY-MM-DD");
  }

  const year = Number(paidAt.slice(0, 4));

  if (year < 2000 || year > 2100) {
    throw new Error("paidAt year must be between 2000 and 2100");
  }

  return paidAt;
}
