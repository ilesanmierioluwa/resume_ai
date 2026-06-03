import { useEffect, useRef, useState } from 'react';
import AlertBanner from './AlertBanner.jsx';
import Spinner from './Spinner.jsx';
import { apiRequest } from '../utils/api.js';

/**
 * Resume-aware chat component for asking follow-up career questions.
 *
 * @param {{analysisId: string, initialMessages?: Array<object>}} props - Analysis id and saved messages.
 * @returns {React.ReactElement|null} Chat interface UI.
 */
export default function ChatInterface({ analysisId, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const [thinking, setThinking] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    /**
     * Loads saved chat messages for the selected analysis from MongoDB.
     *
     * @returns {Promise<void>} Resolves after chat history is fetched.
     */
    async function loadMessages() {
      if (!analysisId) {
        return;
      }

      setLoadingHistory(true);
      setError('');

      try {
        const data = await apiRequest(`/api/history/${analysisId}`);
        if (!cancelled) {
          setMessages(data.messages || initialMessages || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setMessages(initialMessages || []);
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, thinking, loadingHistory]);

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

    const optimisticMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(optimisticMessages);
    setMessage('');
    setError('');
    setThinking(true);

    try {
      const data = await apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: trimmed, analysisId, history: messages })
      });
      setMessages([...optimisticMessages, { role: 'assistant', content: data.reply }]);
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
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  if (!analysisId) {
    return null;
  }

  return (
    <section className="animate-fadeIn rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-950">Chat History</h2>
        <p className="mt-1 text-sm text-slate-500">Continue asking questions about this resume.</p>
      </div>

      <div className="px-5 pt-4">
        <AlertBanner message={error} onClose={() => setError('')} />
      </div>

      <div ref={threadRef} className="mx-5 h-96 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
        {loadingHistory ? <Spinner message="Loading chat history..." /> : null}
        {!loadingHistory && messages.length === 0 ? (
          <p className="text-sm text-slate-500">Ask a question about your resume, career path, or interview preparation.</p>
        ) : null}

        <div className="space-y-4">
          {messages.map((item, index) => (
            <ChatMessage key={`${item.role}-${index}`} message={item} />
          ))}
          {thinking ? <Spinner message="Thinking..." /> : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask ResumeAI a follow-up question"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={thinking}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Send
        </button>
      </div>
    </section>
  );
}

/**
 * Displays one chat message with role-specific alignment and formatted content.
 *
 * @param {{message: {role: string, content: string, createdAt?: string}}} props - Chat message props.
 * @returns {React.ReactElement} Chat message UI.
 */
function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-lg border px-4 py-3 text-sm leading-6 ${isUser ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-800'}`}>
        <FormattedMessage text={message.content} isUser={isUser} />
        {message.createdAt ? <p className={`mt-2 text-xs ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>{new Date(message.createdAt).toLocaleString()}</p> : null}
      </div>
    </div>
  );
}

/**
 * Converts simple AI markdown into React elements without injecting HTML.
 *
 * @param {{text: string, isUser: boolean}} props - Text and role flag.
 * @returns {React.ReactElement} Formatted message content.
 */
function FormattedMessage({ text, isUser }) {
  const blocks = parseMessageBlocks(text);

  return (
    <div className={`space-y-3 ${isUser ? 'text-white' : 'text-slate-800'}`}>
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{formatInlineText(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === 'numbered-list') {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{formatInlineText(item)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === 'code') {
          return (
            <pre key={index} className="overflow-x-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">
              <code>{block.content}</code>
            </pre>
          );
        }

        return (
          <p key={index} className="whitespace-pre-wrap">
            {formatInlineText(block.content)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Splits message text into paragraph, list, numbered list, and code blocks.
 *
 * @param {string} text - Raw message content.
 * @returns {Array<object>} Parsed message blocks.
 */
function parseMessageBlocks(text = '') {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let list = null;
  let code = [];
  let inCode = false;

  /**
   * Flushes any pending paragraph text into the block list.
   *
   * @returns {void}
   */
  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', content: paragraph.join('\n').trim() });
      paragraph = [];
    }
  }

  /**
   * Flushes any pending bullet or numbered list into the block list.
   *
   * @returns {void}
   */
  function flushList() {
    if (list?.items.length) {
      blocks.push(list);
    }
    list = null;
  }

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        blocks.push({ type: 'code', content: code.join('\n') });
        code = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    const bulletMatch = line.match(/^\s*[-*]\s+(.+)/);
    const numberMatch = line.match(/^\s*\d+[.)]\s+(.+)/);

    if (bulletMatch) {
      flushParagraph();
      if (list?.type !== 'list') {
        flushList();
        list = { type: 'list', items: [] };
      }
      list.items.push(bulletMatch[1]);
      continue;
    }

    if (numberMatch) {
      flushParagraph();
      if (list?.type !== 'numbered-list') {
        flushList();
        list = { type: 'numbered-list', items: [] };
      }
      list.items.push(numberMatch[1]);
      continue;
    }

    flushList();

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    paragraph.push(line);
  }

  if (inCode) {
    blocks.push({ type: 'code', content: code.join('\n') });
  }
  flushParagraph();
  flushList();

  return blocks.length ? blocks : [{ type: 'paragraph', content: '' }];
}

/**
 * Formats simple bold markdown inside a line.
 *
 * @param {string} value - Inline text value.
 * @returns {Array<string|React.ReactElement>} Text with bold spans.
 */
function formatInlineText(value) {
  const parts = String(value).split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

