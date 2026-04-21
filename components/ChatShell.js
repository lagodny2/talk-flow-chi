"use client";

import { useEffect, useRef, useState, useTransition } from "react";

const STARTERS = [
  "Build a startup launch plan",
  "Write landing page copy",
  "Help me prepare for an interview"
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I am Nova. I can help with writing, ideas, code, strategy, and day-to-day tasks."
};

export default function ChatShell() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const listRef = useRef(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }

    node.scrollTo({
      top: node.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isPending]);

  function submitMessage(text) {
    const value = text.trim();

    if (!value || isPending) {
      return;
    }

    setError("");
    const nextMessages = [...messages, { role: "user", content: value }];
    setMessages(nextMessages);
    setInput("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ messages: nextMessages })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Could not get a response.");
        }

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: data.message
          }
        ]);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMessage(input);
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="hero-card">
        <p className="eyebrow">AI assistant for your website</p>
        <h1>Nova AI</h1>
        <p className="hero-copy">
          A modern AI chat experience for your website, ready for Vercel
          deployment and connected through the OpenAI API.
        </p>

        <div className="starter-row">
          {STARTERS.map((starter) => (
            <button
              key={starter}
              className="starter-chip"
              onClick={() => submitMessage(starter)}
              type="button"
            >
              {starter}
            </button>
          ))}
        </div>
      </section>

      <section className="chat-card">
        <div className="chat-topbar">
          <div>
            <p className="status-label">Online assistant</p>
            <h2>Chat</h2>
          </div>
          <div className="status-pill">
            <span className="status-dot" />
            OpenAI connected
          </div>
        </div>

        <div className="message-list" ref={listRef}>
          {messages.map((message, index) => (
            <article
              className={`message-bubble ${message.role}`}
              key={`${message.role}-${index}`}
            >
              <span className="message-role">
                {message.role === "assistant" ? "Nova" : "You"}
              </span>
              <p>{message.content}</p>
            </article>
          ))}

          {isPending ? (
            <article className="message-bubble assistant typing">
              <span className="message-role">Nova</span>
              <p>Typing a reply...</p>
            </article>
          ) : null}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            className="composer-input"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Write your message..."
            rows={3}
            value={input}
          />
          <button className="send-button" disabled={isPending} type="submit">
            {isPending ? "Sending..." : "Send"}
          </button>
        </form>

        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </main>
  );
}
