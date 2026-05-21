"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssess() {
    if (!input) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      setResponse("System error. Try again.");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "120px auto",
        padding: "0 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <p
          style={{
            fontSize: "13px",
            color: "#888",
            marginBottom: "12px",
          }}
        >
          Decision interface
        </p>

        <h1
          style={{
            fontSize: "34px",
            fontWeight: "600",
            letterSpacing: "-0.02em",
            marginBottom: "12px",
          }}
        >
          Carbon systems. Assessed.
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#555",
            lineHeight: "1.5",
            maxWidth: "520px",
          }}
        >
          Evaluate carbon projects, claims, and mechanisms through structured
          reasoning — not narratives.
        </p>
      </div>

      {/* INPUT */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe a project, claim, or question..."
        style={{
          width: "100%",
          height: "120px",
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "14px",
          marginBottom: "16px",
          outline: "none",
        }}
      />

      {/* SUGGESTIONS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {[
          "Are carbon offsets structurally credible?",
          "MRV reliability in forest projects",
          "Key failure points in carbon markets",
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => setInput(item)}
            style={{
              padding: "8px 12px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleAssess}
        style={{
          background: "#000",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Assess"}
      </button>

      {/* RESPONSE */}
      {response && (
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            borderRadius: "12px",
            background: "#f7f7f7",
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          {response}
        </div>
      )}

      {/* FOOTNOTE */}
      <p
        style={{
          marginTop: "40px",
          fontSize: "12px",
          color: "#888",
        }}
      >
        Outputs are structured for decision support. Independent validation is
        required.
      </p>
    </main>
  );
}