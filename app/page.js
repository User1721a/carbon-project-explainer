"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("evaluate");

  const examples = [
    "Can carbon offsets be considered greenwashing?",
    "How reliable is MRV in forest carbon projects?",
    "What are the biggest risks in carbon markets?",
    "Compare carbon removal and emissions reduction.",
  ];

  async function handleExplain() {
    if (!question.trim()) {
      setAnswer("Please describe a carbon project, claim, or question first.");
      return;
    }

    setLoading(true);
    setAnswer("Loading...");

    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, mode }),
    });

    const data = await response.json();

    if (!response.ok) {
      setAnswer(
        "The carbon explainer is temporarily unavailable. Please try again shortly."
      );
      setLoading(false);
      return;
    }

    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "80px auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        lineHeight: "1.5",
      }}
    >
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
        Climate decision-support tool
      </p>

      <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>
        Carbon Project Explainer Tool
      </h1>

      <p style={{ fontSize: "18px", color: "#333", marginBottom: "14px" }}>
        Understand carbon systems before you rely on them.
      </p>

      <p style={{ fontSize: "16px", color: "#555", marginBottom: "24px" }}>
        Assess carbon credits, MRV logic, AFOLU, emissions reduction, carbon
        removal, and project credibility through structured responses.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["explain", "evaluate", "compare"].map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #ddd",
              backgroundColor: mode === item ? "#111" : "#fff",
              color: mode === item ? "#fff" : "#111",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Describe a carbon project, claim, or question..."
        style={{
          width: "100%",
          height: "140px",
          padding: "16px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          resize: "vertical",
        }}
      />

      <p style={{ marginTop: "16px", color: "#777", fontSize: "14px" }}>
        Try assessing:
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => setQuestion(example)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "999px",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            {example}
          </button>
        ))}
      </div>

      <button
        onClick={handleExplain}
        disabled={loading}
        style={{
          padding: "14px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#111",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Assessing..." : "Assess"}
      </button>

      {answer && (
        <section
          style={{
            marginTop: "32px",
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#fafafa",
            whiteSpace: "pre-wrap",
          }}
        >
          {answer.split("\n").map((line, index) => (
            <p key={index} style={{ marginBottom: "12px" }}>
              {line}
            </p>
          ))}
        </section>
      )}

      <p style={{ marginTop: "24px", color: "#777", fontSize: "13px" }}>
        This tool supports structured understanding. Critical decisions should
        always be validated independently.
      </p>
    </main>
  );
}