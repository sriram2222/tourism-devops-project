'use client';

import { useState } from "react";

export default function TourismChatbot() {
  const [open, setOpen] = useState(false);

  const quickReplies = [
    "Top places in Pollachi",
    "Palani temple timings",
    "Best time to visit valparai",
    "Contact admin",
    "Masani Amman temple timing"
  ];

  function getBotReply(msg: string) {
    msg = msg.toLowerCase();

    if (msg.includes("pollachi"))
      return "Top places in Pollachi 🌿:\n• Anamalai Tiger Reserve\n• Monkey Falls\n• Valparai\n• Top Slip";

    if (msg.includes("palani"))
      return "Palani Murugan Temple 🕌 timings:\n5:00 AM – 9:00 PM\nBest time: Nov–Mar";

    if (msg.includes("best time"))
      return "Best time to visit 🌤️:\nPollachi: Oct–Mar\nPalani: Nov–Feb";

    if (msg.includes("contact"))
      return "Contact Admin 📞:\nEmail: admin@pptourism.com";

    return "Welcome to PP Tourism 🌿\nAsk about Pollachi, Palani, temple timings or places.";
  }

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 Welcome to PP Tourism!\nHow can I help you?" },
  ]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { from: "user", text }]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: getBotReply(text) },
      ]);
    }, 500);
  }

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-green-700 hover:bg-green-600 text-white text-2xl shadow-lg"
      >
        💬
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[999] border">

          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 font-semibold">
            PP Tourism Chat
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i}
                className={`p-2 rounded-lg max-w-[80%] whitespace-pre-line ${
                  m.from === "user"
                    ? "ml-auto bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 dark:text-white"
                }`}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick buttons */}
          <div className="p-2 flex flex-wrap gap-2 border-t">
            {quickReplies.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg"
              >
                {q}
              </button>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
