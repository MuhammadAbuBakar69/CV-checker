import React, { useEffect, useState, useRef } from "react";

// Generic Chat widget that supports three modes:
// - iframe mode (VITE_CHATBASE_IFRAME_URL + VITE_CHATBASE_KEY)
// - native API mode (VITE_CHATBASE_API_URL + VITE_CHATBASE_KEY)
// - guidance mode (key present but no host/API set)

type Message = { id: string; from: "user" | "bot"; text: string };

export default function ChatbaseWidget(): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Env vars
  const CHATBASE_KEY = (import.meta.env as any).VITE_CHATBASE_KEY as string | undefined;
  const IFRAME_URL = (import.meta.env as any).VITE_CHATBASE_IFRAME_URL as string | undefined;
  const API_URL = (import.meta.env as any).VITE_CHATBASE_API_URL as string | undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (!mounted) return null;
  if (!CHATBASE_KEY) return null; // explicit opt-in required

  const sendToApi = async (text: string) => {
    if (!API_URL) throw new Error("No API URL configured");
    setLoading(true);
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHATBASE_KEY}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`API ${resp.status}: ${errText}`);
      }

      const json = await resp.json();
      // Expect shape: { reply: string } or { message: { content: '...' } }
      const reply = (json.reply as string) || (json.message?.content as string) || JSON.stringify(json);
      return reply;
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: String(Date.now()) + "-u", from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    if (API_URL) {
      try {
        const botReply = await sendToApi(text);
        const botMsg: Message = { id: String(Date.now()) + "-b", from: "bot", text: botReply };
        setMessages((m) => [...m, botMsg]);
      } catch (e: any) {
        const errMsg: Message = { id: String(Date.now()) + "-e", from: "bot", text: `Error: ${e.message}` };
        setMessages((m) => [...m, errMsg]);
      }
    } else {
      // If no API URL, show guidance message
      const info: Message = { id: String(Date.now()) + "-i", from: "bot", text: "No Chatbase API URL configured. Set VITE_CHATBASE_API_URL in .env to enable native chat mode." };
      setMessages((m) => [...m, info]);
    }
  };

  return (
    <>
      <button
        aria-label="Open chat"
        onClick={() => setOpen((s) => !s)}
        className="fixed right-4 bottom-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.83L3 21l1.83-4.17A9.863 9.863 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" />

          <div className="relative pointer-events-auto w-full max-w-md mb-20 mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center gap-2">
                <strong>Chat</strong>
                <span className="text-xs text-gray-500">powered by Chatbase</span>
              </div>
              <div>
                <button onClick={() => setOpen(false)} className="p-1 text-gray-600 hover:text-gray-800">
                  ✕
                </button>
              </div>
            </div>

            {/* iframe mode */}
            {IFRAME_URL ? (
              <iframe
                title="Chatbase Chat"
                src={`${IFRAME_URL}${IFRAME_URL.includes("?") ? "&" : "?"}key=${encodeURIComponent(CHATBASE_KEY)}`}
                className="w-full h-96"
              />
            ) : (
              // native chat mode / guidance
              <div className="flex flex-col h-96">
                <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-2">
                  {messages.length === 0 && (
                    <div className="text-xs text-gray-500">Say hi 👋 — your messages will be sent to the configured Chatbase API.</div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg ${m.from === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                      placeholder={API_URL ? "Type a message..." : "No API URL configured. Set VITE_CHATBASE_API_URL in .env"}
                      className="flex-1 px-3 py-2 rounded border"
                      disabled={loading || !API_URL}
                    />
                    <button onClick={handleSend} disabled={loading || !API_URL} className="bg-indigo-600 text-white px-4 rounded">
                      {loading ? "…" : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
