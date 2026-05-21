"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssess() {
    if (!question.trim()) {
      setAnswer("Please describe a carbon project, claim, or question first.");
      return;
    }

    setLoading(true);
    setAnswer("Loading...");

    const selectedMode =
      question.toLowerCase().includes("compare") ||
      question.toLowerCase().includes("difference")
        ? "compare"
        : "evaluate";

    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, mode: selectedMode }),
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

  const examples = [
    "Can carbon offsets be considered greenwashing?",
    "How reliable is MRV in forest carbon projects?",
    "What are the biggest risks in carbon markets?",
    "Compare carbon removal and emissions reduction.",
  ];

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "96px auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        lineHeight: "1.5",
      }}
    >
      <p
        style={{
          color: "#888",
          fontSize: "13px",
          marginBottom: "12px",
          letterSpacing: "0.3px",
        }}
      >
        Decision support
      </p>

      <h1
        style={{
          fontSize: "48px",
          lineHeight: "1.05",
          marginBottom: "18px",
          fontWeight: "600",
          letterSpacing: "-1.5px",
          color: "#111",
        }}
      >
        Assess carbon claims.
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#444",
          marginBottom: "34px",
          maxWidth: "640px",
        }}
      >
        Test credibility, identify risks, and understand what is actually being
        claimed — before acting on it.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Describe a carbon project, credit claim, or framework question..."
        style={{
          width: "100%",
          height: "150px",
          padding: "18px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "14px",
          resize: "vertical",
          outline: "none",
        }}
      />

      <p style={{ marginTop: "18px", color: "#777", fontSize: "14px" }}>
        Start with:
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => setQuestion(example)}
            style={{
              padding: "8px 13px",
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
        onClick={handleAssess}
        disabled={loading}
        style={{
          padding: "14px 26px",
          fontSize: "16px",
          border: "none",
          borderRadius: "10px",
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
            marginTop: "36px",
            padding: "26px",
            border: "1px solid #e5e5e5",
            borderRadius: "18px",
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