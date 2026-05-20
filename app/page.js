"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const examples = [
    "What is MRV in carbon projects?",
    "How do carbon credits work?",
    "What is the difference between carbon removal and emissions reduction?",
  ];

  async function handleExplain() {
    if (!question.trim()) {
      setAnswer("Please write a question first.");
      return;
    }

    setLoading(true);
    setAnswer("Loading...");

    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
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
        Climate education tool
      </p>

      <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>
        Carbon Project Explainer Tool
      </h1>

      <p style={{ fontSize: "18px", color: "#333", marginBottom: "14px" }}>
        Understand carbon projects. Clearly.
      </p>

      <p style={{ fontSize: "16px", color: "#555", marginBottom: "24px" }}>
        Ask a question about carbon credits, AFOLU, MRV, afforestation,
        reforestation, carbon removal, or climate projects.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about carbon projects..."
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

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
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
          marginTop: "16px",
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
        {loading ? "Thinking..." : "Explain"}
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
        Educational use only. This tool does not provide financial, legal, or
        certification advice.
      </p>
    </main>
  );
}