"use client";

import { useState } from "react";
import {
  addChild,
  addLesson,
  listLessonsForChild
} from "../src/lessons.js";

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

export default function Home() {
  const [children, setChildren] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [childName, setChildName] = useState("");
  const [lessonForms, setLessonForms] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  function registerChild(event) {
    event.preventDefault();

    const id = `child-${Date.now()}`;
    setChildren((current) => addChild(current, { id, name: childName }));
    setChildName("");
    setLessonForms((current) => ({ ...current, [id]: "" }));
  }

  function updateLessonForm(childId, name) {
    setLessonForms((current) => ({ ...current, [childId]: name }));
  }

  function registerLesson(event, childId) {
    event.preventDefault();

    const name = lessonForms[childId] || "";
    setLessons((current) => addLesson(children, current, {
      id: `lesson-${Date.now()}`,
      childId,
      name
    }));
    updateLessonForm(childId, "");
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
