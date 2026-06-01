import { useEffect, useRef, useState } from "react";
import AlertBanner from "./AlertBanner.jsx";
import Spinner from "./Spinner.jsx";
import { apiRequest } from "../utils/api.js";

/**
 * Resume-aware chat component for asking follow-up career questions.
 *
 * @param {{analysisId: string, initialMessages?: Array<object>}} props - Analysis id and saved messages.
 * @returns {React.ReactElement|null} Chat interface UI.
 */
export default function ChatInterface({ analysisId, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, analysisId]);

  // Persist/load chat messages per analysis in localStorage so they survive refresh
  useEffect(() => {
    if (!analysisId) return;
    const key = `resumeai_chat_${analysisId}`;

    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
        return;
      } catch (_) {
        // fall through to fetch
      }
    }

    // If initial messages provided, save them
    if (initialMessages && initialMessages.length) {
      localStorage.setItem(key, JSON.stringify(initialMessages));
      setMessages(initialMessages);
      return;
    }

    // Otherwise try to load from server history
    (async () => {
      try {
        const data = await apiRequest(`/api/history/${analysisId}`);
        const msgs = (data.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        }));
        setMessages(msgs);
        localStorage.setItem(key, JSON.stringify(msgs));
      } catch (err) {
        // ignore; user can still chat
      }
    })();
  }, [analysisId]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (!analysisId) return;
    try {
      const key = `resumeai_chat_${analysisId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (_) {}
  }, [messages, analysisId]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  /**
   * Sends the user's message to the backend and appends the AI reply.
   *
   * @returns {Promise<void>} Resolves after the chat request completes.
   */
  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || thinking) {
      return;
    }

    const optimisticMessages = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(optimisticMessages);
    setMessage("");
    setError("");
    setThinking(true);

    try {
      const data = await apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          analysisId,
          history: messages,
        }),
      });
      setMessages([
        ...optimisticMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages(messages);
    } finally {
      setThinking(false);
    }
  }

  /**
   * Sends the message when Enter is pressed without Shift.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} event - Keyboard event.
   * @returns {void}
   */
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  if (!analysisId) {
    return null;
  }

  return (
    <section className="animate-fadeIn rounded-xl bg-white p-5 shadow-md">
      <h2 className="text-2xl font-bold text-blue-600">Chat Interface</h2>
      <AlertBanner message={error} onClose={() => setError("")} />
      <div
        ref={threadRef}
        className="mt-4 h-80 overflow-y-auto rounded-xl bg-slate-50 p-4"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ask a question about your resume, career path, or interview
            preparation.
          </p>
        ) : null}
        <div className="space-y-4">
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`flex items-start gap-3 ${item.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {item.role === "assistant" ? (
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700">
                  AI
                </div>
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                  U
                </div>
              )}

              <div className="min-w-0">
                <div
                  className={`rounded-lg px-4 py-3 text-sm leading-6 shadow ${item.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-slate-100 text-slate-800"}`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderContent(item.content),
                    }}
                  />
                </div>
                {item.createdAt ? (
                  <div className="mt-1 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {thinking ? <Spinner message="Thinking..." /> : null}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask ResumeAI a follow-up question"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={thinking}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Send
        </button>
      </div>
    </section>
  );
}

/**
 * Escape HTML to prevent XSS when injecting HTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Very small, safe formatter for AI responses: handles code blocks, lists and line breaks.
 * Keeps output safe by escaping then selectively converting simple markdown to HTML.
 * @param {string} text
 * @returns {string} HTML
 */
function renderContent(text) {
  const raw = text || "";

  // Handle fenced code blocks ```...```
  const codeBlockRegex = /```([\s\S]*?)```/g;
  let html = escapeHtml(raw).replace(codeBlockRegex, (_m, code) => {
    return `<pre class="rounded-md bg-slate-900 p-3 text-sm text-slate-100 overflow-auto"><code>${escapeHtml(code)}</code></pre>`;
  });

  // Handle lines that start with '- ' as a list
  const lines = html.split(/\r?\n/);
  let inList = false;
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*-\s+/.test(line)) {
      if (!inList) {
        inList = true;
        out.push('<ul class="list-disc pl-5">');
      }
      out.push(`<li>${line.replace(/^\s*-\s+/, "")}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      // Preserve blank lines as paragraph breaks
      if (line.trim() === "") {
        out.push("<p></p>");
      } else {
        out.push(line.replace(/\n/g, "<br/>"));
      }
    }
  }

  if (inList) out.push("</ul>");

  // Join and collapse multiple <p></p> into single breaks
  return out.join("\n").replace(/<p><\/p>(\s*<p><\/p>)+/g, "<p></p>");
}
