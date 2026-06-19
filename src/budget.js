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
  const paidAt = normalizeRequiredString(input.paidAt, "paidAt");

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

function normalizeRequiredString(value, fieldName) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`);
  }

  return normalizedValue;
}
