import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchChat } from '../api/client';
import { getTodayCheckIn, getLast7Days } from '../utils/storage';

export default function Chat() {
  const { profile } = useOutletContext();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm StudySync AI, your wellness companion. How are you feeling about your prep today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const checkIn = getTodayCheckIn();
      const recentHistory = getLast7Days();
      const reply = await fetchChat(profile, text, checkIn, recentHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply.message, isCrisis: reply.isCrisis }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col" style={{ height: 'calc(100vh - 180px)' }}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Companion Chat</h2>
        <p className="text-sm text-ss-muted">Talk to StudySync AI — your empathetic study wellness companion.</p>
      </div>

      <div className="mb-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs text-amber-200/90">
        StudySync AI supports emotional wellness and is not a substitute for professional help.
      </div>

      <div className="ss-card flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-500/20 text-indigo-100'
                    : msg.isCrisis
                      ? 'border border-red-400/30 bg-red-400/10 text-red-100'
                      : 'bg-white/5 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-400/30 border-t-teal-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-ss-border p-4">
          <div className="flex gap-3">
            <input
              className="ss-input flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              disabled={loading}
            />
            <button type="submit" className="ss-btn shrink-0" disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
