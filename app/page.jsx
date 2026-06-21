"use client";

import { useEffect, useState } from "react";
import {
  createExpense,
  filterByMonth,
  summarizeByChild,
  summarizeByLesson,
  totalByMonth
} from "../src/budget.js";
import {
  addChild,
  addLesson,
  listLessonsForChild
} from "../src/lessons.js";
import {
  loadFromStorage,
  saveToStorage
} from "../src/storage.js";

const roadmap = [
  "AIに3つだけ質問してもらい、自分向け家計簿のゴールを決める",
  "要件をdocs/my-budget-app-requirements.mdにまとめる",
  "GitHub Issueへ小さく分解する",
  "Codex appで1 Issueずつ実装する",
  "localhostで動作確認する",
  "PRの差分・テスト・リスクをレビューする",
  "本番環境との違いを説明する",
  "自分専用機能を1つ追加する"
];

const requirementQuestions = [
  "毎月いちばん見えるようにしたいお金の不安や目標は何ですか？",
  "いつ・どこで家計簿を入力したいですか？スマホ中心、PC中心、週末まとめ入力などを教えてください。",
  "技術構成はどうしますか？推奨はNext.jsです。もっと軽くするならHTML/JavaScript、Reactだけを学びたいならVite + Reactも選べます。"
];

const issueSeeds = [
  "支出入力フォームを作る",
  "支出一覧を表示する",
  "カテゴリ別合計を表示する",
  "月別フィルタを追加する",
  "localStorageで保存する",
  "PRレビュー用チェックリストを追加する"
];

const minPaidAt = "2000-01-01";
const maxPaidAt = "2100-12-31";
const today = formatDateInputValue(new Date());
const currentMonth = today.slice(0, 7);
const childrenStorageKey = "narajigo:children";
const lessonsStorageKey = "narajigo:lessons";
const expensesStorageKey = "narajigo:expenses";

export default function Home() {
  const [children, setChildren] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [childName, setChildName] = useState("");
  const [lessonForms, setLessonForms] = useState({});
  const [expenseForm, setExpenseForm] = useState({
    childId: "",
    lessonId: "",
    amount: "",
    paidAt: today,
    note: ""
  });
  const [completedSteps, setCompletedSteps] = useState([]);
  const selectedChildLessons = listLessonsForChild(lessons, expenseForm.childId);
  const selectedMonthExpenses = filterByMonth(expenses, selectedMonth);
  const selectedMonthTotal = totalByMonth(expenses, selectedMonth);
  const childSummary = summarizeByChild(selectedMonthExpenses, children);
  const lessonSummary = summarizeByLesson(selectedMonthExpenses, lessons);

  useEffect(() => {
    setChildren(loadFromStorage(childrenStorageKey, []));
    setLessons(loadFromStorage(lessonsStorageKey, []));
    setExpenses(loadFromStorage(expensesStorageKey, []));
    setIsStorageReady(true);
  }, []);

  useEffect(() => {
    if (isStorageReady) {
      saveToStorage(childrenStorageKey, children);
    }
  }, [children, isStorageReady]);

  useEffect(() => {
    if (isStorageReady) {
      saveToStorage(lessonsStorageKey, lessons);
    }
  }, [lessons, isStorageReady]);

  useEffect(() => {
    if (isStorageReady) {
      saveToStorage(expensesStorageKey, expenses);
    }
  }, [expenses, isStorageReady]);

  function registerChild(event) {
    event.preventDefault();

    const id = `child-${Date.now()}`;
    setChildren((current) => addChild(current, { id, name: childName }));
    setChildName("");
    setLessonForms((current) => ({ ...current, [id]: "" }));
    setExpenseForm((current) => (
      current.childId ? current : { ...current, childId: id, lessonId: "" }
    ));
  }

  function updateLessonForm(childId, name) {
    setLessonForms((current) => ({ ...current, [childId]: name }));
  }

  function registerLesson(event, childId) {
    event.preventDefault();

    const name = lessonForms[childId] || "";
    const id = `lesson-${Date.now()}`;
    setLessons((current) => addLesson(children, current, {
      id,
      childId,
      name
    }));
    setExpenseForm((current) => (
      current.childId === childId && !current.lessonId
        ? { ...current, lessonId: id }
        : current
    ));
    updateLessonForm(childId, "");
  }

  function updateExpenseChild(childId) {
    const childLessons = listLessonsForChild(lessons, childId);

    setExpenseForm((current) => ({
      ...current,
      childId,
      lessonId: childLessons[0]?.id || ""
    }));
  }

  function updateExpenseForm(field, value) {
    setExpenseForm((current) => ({ ...current, [field]: value }));
  }

  function registerExpense(event) {
    event.preventDefault();

    const expense = createExpense({
      ...expenseForm,
      id: `expense-${Date.now()}`
    });
    setExpenses((current) => [expense, ...current]);
    setExpenseForm((current) => ({
      ...current,
      amount: "",
      note: ""
    }));
  }

  function findChildName(childId) {
    return children.find((child) => child.id === childId)?.name || "未登録の子供";
  }

  function findLessonName(lessonId) {
    return lessons.find((lesson) => lesson.id === lessonId)?.name || "未登録の習い事";
  }

  function toggleStep(index) {
    setCompletedSteps((current) => (
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    ));
  }

  return (
    <main className="page-shell">
      <section className="intro-band">
        <div>
          <p className="eyebrow">App-first Codex Training</p>
          <h1>あなたにぴったりの家計簿アプリを作りながら学ぶ</h1>
          <p className="lead">
            AIとの要件定義、GitHub Issue、Codex appでの実装、localhost確認、
            PRレビューまでを1つのアプリ制作で練習します。
          </p>
        </div>
        <div className="status-panel" aria-label="学習進捗">
          <span>進捗</span>
          <strong>{completedSteps.length} / {roadmap.length}</strong>
          <small>まず動かし、必要になったところで学ぶ。</small>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="tool-panel">
          <div className="panel-heading">
            <p className="eyebrow">Step 1</p>
            <h2>AIと要件定義</h2>
          </div>
          <p className="helper-text">
            受講者にはAIから1問ずつ質問してもらい、自分用のゴールを決めてもらいます。
          </p>
          <ol className="question-list">
            {requirementQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
          <div className="prompt-box">
            <span>AIに渡す最初の依頼</span>
            <code>
              あなたにぴったりの家計簿アプリを作りたいです。良いアウトプットを出すために、私に聞きたいことを3つに絞って質問してください。質問は1つずつ行ってください。
            </code>
          </div>
        </div>

        <div className="tool-panel">
          <div className="panel-heading">
            <p className="eyebrow">Step 2</p>
            <h2>Issueに分解</h2>
          </div>
          <p className="helper-text">
            要件が決まったら、1 Issue = 1つの小さな機能にします。
          </p>
          <ul className="issue-list">
            {issueSeeds.map((issue) => (
              <li key={issue}>
                <span>{issue}</span>
                <small>DoD / やらないこと / 確認方法を書く</small>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="app-band">
        <div className="panel-heading">
          <p className="eyebrow">Issue #1</p>
          <h2>子供と習い事の登録</h2>
        </div>
        <div className="lesson-layout">
          <form className="child-form" onSubmit={registerChild}>
            <label>
              子供の名前
              <input
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                placeholder="例: 長男"
                required
              />
            </label>
            <button type="submit">子供を追加</button>
          </form>

          <div className="lesson-summary" aria-label="登録状況">
            <div>
              <span>子供</span>
              <strong>{children.length}人</strong>
            </div>
            <div>
              <span>習い事</span>
              <strong>{lessons.length}件</strong>
            </div>
          </div>
        </div>

        <div className="children-list">
          {children.length === 0 ? (
            <p className="empty-state">子供を追加すると、ここに習い事フォームが表示されます。</p>
          ) : null}
          {children.map((child) => {
            const childLessons = listLessonsForChild(lessons, child.id);

            return (
              <article key={child.id} className="child-item">
                <div className="child-heading">
                  <h3>{child.name}</h3>
                  <span>{childLessons.length}件の習い事</span>
                </div>
                <form className="lesson-form" onSubmit={(event) => registerLesson(event, child.id)}>
                  <label>
                    習い事名
                    <input
                      value={lessonForms[child.id] || ""}
                      onChange={(event) => updateLessonForm(child.id, event.target.value)}
                      placeholder="例: 水泳"
                      required
                    />
                  </label>
                  <button type="submit">習い事を追加</button>
                </form>
                {childLessons.length > 0 ? (
                  <ul className="lesson-list">
                    {childLessons.map((lesson) => (
                      <li key={lesson.id}>{lesson.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-state">まだ習い事は登録されていません。</p>
                )}
              </article>
            );
          })}
        </div>

        <div className="expense-section">
          <div className="panel-heading">
            <p className="eyebrow">Issue #2 - #3</p>
            <h2>支出入力</h2>
          </div>
          <div className="month-summary">
            <div className="monthly-total">
              <span>選択中の月の合計</span>
              <strong>{selectedMonthTotal.toLocaleString()}円</strong>
            </div>
            <label>
              月
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                onInput={(event) => setSelectedMonth(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className="child-total-section">
            <div className="panel-heading">
              <p className="eyebrow">Issue #4</p>
              <h2>子供別合計</h2>
            </div>
            <div className="child-total-list">
              {children.length === 0 ? (
                <p className="empty-state">子供を追加すると、ここに子供別合計が表示されます。</p>
              ) : null}
              {children.map((child) => (
                <div key={child.id} className="child-total-item">
                  <span>{child.name}</span>
                  <strong>{(childSummary[child.id] || 0).toLocaleString()}円</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="lesson-total-section">
            <div className="panel-heading">
              <p className="eyebrow">Issue #5</p>
              <h2>習い事別合計</h2>
            </div>
            <div className="lesson-total-list">
              {lessons.length === 0 ? (
                <p className="empty-state">習い事を追加すると、ここに習い事別合計が表示されます。</p>
              ) : null}
              {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-total-item">
                  <span>{findChildName(lesson.childId)} - {lesson.name}</span>
                  <strong>{(lessonSummary[lesson.id] || 0).toLocaleString()}円</strong>
                </div>
              ))}
            </div>
          </div>
          <form className="expense-form" onSubmit={registerExpense}>
            <label>
              子供
              <select
                value={expenseForm.childId}
                onChange={(event) => updateExpenseChild(event.target.value)}
                required
              >
                <option value="">子供を選択</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </label>
            <label>
              習い事
              <select
                value={expenseForm.lessonId}
                onChange={(event) => updateExpenseForm("lessonId", event.target.value)}
                disabled={!expenseForm.childId || selectedChildLessons.length === 0}
                required
              >
                <option value="">習い事を選択</option>
                {selectedChildLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                ))}
              </select>
            </label>
            <label>
              金額
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={expenseForm.amount}
                onChange={(event) => updateExpenseForm("amount", event.target.value)}
                placeholder="例: 1500"
                required
              />
            </label>
            <button type="submit" disabled={!expenseForm.childId || !expenseForm.lessonId}>
              支出を追加
            </button>
            <label>
              日付
              <input
                type="date"
                min={minPaidAt}
                max={maxPaidAt}
                value={expenseForm.paidAt}
                onChange={(event) => updateExpenseForm("paidAt", event.target.value)}
                onInput={(event) => updateExpenseForm("paidAt", event.currentTarget.value)}
                required
              />
            </label>
            <label className="wide">
              メモ
              <input
                value={expenseForm.note}
                onChange={(event) => updateExpenseForm("note", event.target.value)}
                placeholder="例: チケット5回"
              />
            </label>
          </form>

          <div className="expense-list">
            {selectedMonthExpenses.length === 0 ? (
              <p className="empty-state">選択した月の支出はまだありません。</p>
            ) : null}
            {selectedMonthExpenses.map((expense) => (
              <article key={expense.id} className="expense-item">
                <div>
                  <strong>{findChildName(expense.childId)} / {findLessonName(expense.lessonId)}</strong>
                  <span>{expense.amount.toLocaleString()}円 / {expense.paidAt}</span>
                  {expense.note ? <small>{expense.note}</small> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="roadmap-band">
        <div className="panel-heading">
          <p className="eyebrow">Learning Assistant</p>
          <h2>現状と次の一手</h2>
        </div>
        <div className="roadmap-list">
          {roadmap.map((step, index) => (
            <label key={step} className={completedSteps.includes(index) ? "step done" : "step"}>
              <input
                type="checkbox"
                checked={completedSteps.includes(index)}
                onChange={() => toggleStep(index)}
              />
              <span>{step}</span>
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
