'use client';

import { useState, useRef, useEffect } from "react";

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["hi","hello","hey","start","help"],
    answer: "👋 Hello! Welcome to **PP Explorer**!\n\nI'm your personal travel guide for Pollachi & Palani. I can help you with:\n\n🌿 Places to visit\n🏨 Stay & Dine options\n⏰ Temple timings\n🌤️ Best time to visit\n🚗 How to reach\n📞 Contact info\n\nWhat would you like to explore today?"
  },
  {
    keywords: ["pollachi","places pollachi","top places"],
    answer: "🌿 **Top Places in Pollachi**\n\n🐯 Anamalai Tiger Reserve — wildlife & safari\n💧 Monkey Falls — scenic waterfall\n🏔️ Valparai — misty hill station\n🌊 Top Slip — forest & wildlife\n🕌 Masani Amman Temple — sacred shrine\n🌊 Aliyar Dam — peaceful reservoir\n🌿 Parambikulam — nature reserve\n\nWhich place would you like to know more about?"
  },
  {
    keywords: ["palani","places palani","palani places"],
    answer: "🕌 **Top Places in Palani**\n\n⛪ Arulmigu Dhandayuthapani Temple — famous Murugan shrine\n🌊 Palar Dam — scenic spot\n🌿 Idumban Hills — trekking & views\n🏔️ Kanakkanpatti Sarguru Temple — spiritual site\n\nPalani is primarily a pilgrimage destination — the Murugan Temple atop the rocky hill is world-famous! 🙏"
  },
  {
    keywords: ["anamalai","tiger reserve","tiger","wildlife","safari"],
    answer: "🐯 **Anamalai Tiger Reserve**\n\n📍 25 km from Pollachi\n⏰ 6:00 AM – 6:00 PM (Tue–Sun)\n💰 Entry: ₹30 (Indian) | ₹300 (Foreign)\n🚗 Jeep safari available\n\n🌟 **Highlights:**\n• Home to tigers, elephants & leopards\n• 958 sq km of rich biodiversity\n• Stunning forest trails\n\n✅ Best time: October – March\n📌 Closed on Mondays"
  },
  {
    keywords: ["monkey falls","waterfall","falls"],
    answer: "💧 **Monkey Falls**\n\n📍 On Pollachi–Valparai highway\n⏰ Open daily: 8:00 AM – 6:00 PM\n💰 Entry: ₹10\n\n🌟 **Highlights:**\n• Beautiful waterfall surrounded by forest\n• Perfect for a refreshing swim\n• Named after the monkeys that gather here\n\n⚠️ Avoid visiting during heavy monsoon for safety\n✅ Best time: July – December"
  },
  {
    keywords: ["valparai","hill station","hills","tea estate"],
    answer: "🏔️ **Valparai**\n\n📍 65 km from Pollachi via 40 hairpin bends\n🌡️ Temperature: 15–25°C year-round\n\n🌟 **Highlights:**\n• Stunning tea & coffee estates\n• Sholayar & Parambikulam dam views\n• Wildlife spotting — elephants, bison\n• Carry sweaters! It gets cold\n\n🚗 Road is scenic but take your time\n✅ Best time: October – March"
  },
  {
    keywords: ["top slip","parambikulam","forest"],
    answer: "🌿 **Top Slip (Indira Gandhi Wildlife Sanctuary)**\n\n📍 35 km from Pollachi\n⏰ 6:00 AM – 6:00 PM\n💰 Entry: ₹25\n\n🌟 **Highlights:**\n• Dense forest with tribal villages\n• Crocodile breeding centre\n• Elephant rides & boat rides\n• Amazing birdwatching\n\n✅ Best time: November – March\n📌 Permit needed for overnight stays"
  },
  {
    keywords: ["aliyar","aliyar dam","dam","reservoir"],
    answer: "🌊 **Aliyar Dam & Park**\n\n📍 20 km from Pollachi\n⏰ 9:00 AM – 5:30 PM\n💰 Entry: ₹10\n\n🌟 **Highlights:**\n• Scenic dam surrounded by greenery\n• Boating facility available\n• Children's park nearby\n• Perfect for a relaxed picnic\n\n✅ Best time: October – February"
  },
  {
    keywords: ["masani","masani temple","masani amman"],
    answer: "🕌 **Masani Amman Temple, Pollachi**\n\n📍 Pollachi town center\n⏰ Morning: 6:00 AM – 1:00 PM\n⏰ Evening: 4:00 PM – 9:00 PM\n💰 Entry: Free\n\n🌟 **About:**\nA highly revered temple dedicated to Goddess Masani Amman. Thousands of devotees visit during festival seasons.\n\n🎉 Chariot festival (Ther) is the biggest celebration here!"
  },
  {
    keywords: ["palani temple","murugan","murugan temple","dhandayuthapani"],
    answer: "🕌 **Arulmigu Dhandayuthapani Swamy Temple, Palani**\n\n📍 Temple Hill, Palani\n⏰ 4:30 AM – 9:00 PM daily\n💰 Entry: Free\n🚡 Winch car / Ropeway: ₹40 (up & down)\n\n🌟 **Highlights:**\n• One of the six sacred Murugan abodes (Arupadai Veedu)\n• Sits atop a 153-step rocky hill\n• Panchamirtham prasadam — world famous!\n\n🙏 Best time: Nov – Mar, Thaipusam festival"
  },
  {
    keywords: ["palar dam","palar"],
    answer: "🌊 **Palar Dam, Palani**\n\n📍 7 km from Palani town\n⏰ Open daily: 9:00 AM – 5:30 PM\n💰 Entry: ₹5\n\n🌟 **Highlights:**\n• Peaceful dam surrounded by rocky hills\n• Scenic photography spot\n• Boating available on weekends\n\n✅ Best time: October – January"
  },
  {
    keywords: ["best time","when to visit","season","weather","climate"],
    answer: "🌤️ **Best Time to Visit**\n\n🌿 **Pollachi & Valparai:**\nOctober – March\n• Cool weather 18–28°C\n• Waterfalls flowing\n• Wildlife active\n\n🕌 **Palani:**\nNovember – February\n• Pleasant for pilgrimage\n• Less crowded\n\n🌧️ **Monsoon (Jul–Sep):**\n• Lush green landscapes\n• Some roads may be blocked\n• Great for photographers!"
  },
  {
    keywords: ["how to reach","reach","travel","bus","train","transport","route"],
    answer: "🚗 **How to Reach Pollachi & Palani**\n\n✈️ **Nearest Airport:**\nCoimbatore (CBE) — 40 km from Pollachi\n\n🚆 **By Train:**\nPollachi has its own railway station\nPalani station — well connected\n\n🚌 **By Bus:**\nFrequent buses from Coimbatore, Chennai, Madurai to both cities\n\n🚗 **By Road:**\nPollachi: NH-544 from Coimbatore\nPalani: 60 km from Dindigul"
  },
  {
    keywords: ["hotel","lodge","stay","accommodation","room","book"],
    answer: "🏨 **Stay Options**\n\n**Pollachi Lodges:**\n• Apple Inn — from ₹1200/night\n• Sitaram Lodge — from ₹900/night\n• Surya Residency — from ₹1700/night\n\n**Pollachi Hotels:**\n• Sri Krishna Residency ⭐⭐⭐⭐⭐\n• Sakthi Resort — Luxury\n• Ratna Square — Premium\n\n**Palani:**\n• Hotel Nakshathra, Sampath Residency & more\n\n👉 Visit Stay & Dine section to book!"
  },
  {
    keywords: ["food","restaurant","eat","dining","veg","meals"],
    answer: "🍽️ **Food & Restaurants**\n\n**Palani (Pure Veg near Temple):**\n• Tamizhan Unavagam — authentic meals\n• Sri Balaji Bhavan — clean & tasty\n• Sri Valli Bhavan — popular pilgrim spot\n• SR Pure Veg — wholesome thali\n\n**Pollachi:**\nLocal dhabas and hotels serve excellent\nSouth Indian meals, biryani & tiffin!\n\n🌟 Try the local Pollachi banana chips — famous!"
  },
  {
    keywords: ["contact","admin","support","email","phone","reach us"],
    answer: "📞 **Contact PP Explorer**\n\n📧 Email: admin@ppexplorer.com\n📱 Phone: +91 98765 43210\n🌐 Website: ppexplorer.com\n\n🕐 Support hours:\nMon – Sat: 9:00 AM – 6:00 PM\n\nOur team is happy to help plan your perfect Pollachi–Palani trip! 🙏"
  },
  {
    keywords: ["thaipusam","festival","kavadi","chariot","car festival"],
    answer: "🎉 **Festivals in Pollachi & Palani**\n\n🕌 **Thaipusam (Palani):**\nJan/Feb — Millions carry kavadi to the hill temple. One of Tamil Nadu's grandest festivals!\n\n🎡 **Masani Ther (Pollachi):**\nThe famous chariot festival draws huge crowds\n\n🌺 **Panguni Uthiram:**\nMarch/April — celebrated at both temples\n\n📅 Dates vary each year based on Tamil calendar"
  },
  {
    keywords: ["trek","trekking","hiking","adventure"],
    answer: "🥾 **Trekking & Adventure**\n\n🏔️ **Valparai:**\n• Tea estate walks\n• Sholayar forest trekking\n\n🌿 **Anamalai Tiger Reserve:**\n• Nature trails with guides\n• Morning bird-watching walks\n\n🌊 **Top Slip:**\n• Forest treks with tribal guides\n\n🏔️ **Idumban Hills (Palani):**\n• Moderate difficulty trek\n• Beautiful sunrise views\n\n⚠️ Always go with a local guide for forest treks!"
  },
];

function streamReply(text: string, onChunk: (partial: string) => void, onDone: () => void) {
  const words = text.split(" ");
  let i = 0;
  let current = "";

  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      onDone();
      return;
    }
    // Stream 1-2 words at a time
    const chunk = words[i] + (words[i + 1] ? " " + words[i + 1] : "");
    current += (i === 0 ? "" : " ") + chunk.trim();
    onChunk(current);
    i += 2;
  }, 35);
}

function getBotReply(msg: string): string {
  const m = msg.toLowerCase();
  for (const entry of KB) {
    if (entry.keywords.some(k => m.includes(k))) return entry.answer;
  }
  return "🌿 I'm not sure about that, but I can help with:\n\n• Places in Pollachi & Palani\n• Temple timings & entry fees\n• Stay & Dine options\n• Best time to visit\n• How to reach\n• Trekking & adventure\n\nTry asking something like *\"Top places in Pollachi\"* or *\"Palani temple timings\"* 😊";
}

const QUICK_REPLIES = [
  { icon: "🌿", label: "Pollachi places", msg: "Top places in Pollachi" },
  { icon: "🕌", label: "Palani temple",   msg: "Palani temple timings"  },
  { icon: "🐯", label: "Tiger Reserve",   msg: "Anamalai tiger reserve" },
  { icon: "🏔️", label: "Valparai",       msg: "Valparai hill station"  },
  { icon: "🏨", label: "Stay options",    msg: "Hotel stay accommodation"},
  { icon: "🌤️", label: "Best time",      msg: "Best time to visit"     },
  { icon: "🚗", label: "How to reach",   msg: "How to reach Pollachi"  },
  { icon: "🍽️", label: "Food & Dine",   msg: "Food restaurant eat"    },
  { icon: "📞", label: "Contact",        msg: "Contact admin support"  },
];

interface Msg { from: "bot" | "user"; text: string; time: string; streaming?: boolean; }

function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// Render text with **bold** support
function RenderText({ text }: { text: string }) {
  return (
    <span>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : <span key={j}>{part}</span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function TourismChatbot() {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "👋 Hello! Welcome to **PP Explorer**!\n\nI'm your personal travel guide for Pollachi & Palani.\n\nAsk me about places, stays, temple timings, or anything about your trip! 🌿", time: getTime() },
  ]);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const chipsRef   = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setInput("");

    // Add user message
    setMessages(prev => [...prev, { from: "user", text, time: getTime() }]);
    setIsTyping(true);

    // Simulate thinking delay then stream reply
    setTimeout(() => {
      const reply = getBotReply(text);

      // Add empty bot message to stream into
      setMessages(prev => [...prev, { from: "bot", text: "", time: getTime(), streaming: true }]);

      streamReply(
        reply,
        (partial) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], text: partial };
            return updated;
          });
        },
        () => {
          setIsTyping(false);
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], text: reply, streaming: false };
            return updated;
          });
        }
      );
    }, 600);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-8 right-8 z-[9999] w-[58px] h-[58px] rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #0c3d1a, #1a6b30)" }}
      >
        <span className={`transition-all duration-300 ${open ? "rotate-90 scale-90" : "rotate-0 scale-100"}`}>
          {open
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          }
        </span>
        {!open && <span className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: "#1a6b30" }} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-[96px] right-8 z-[9998] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{
        width: "min(360px, calc(100vw - 32px))",
        height: "min(560px, calc(100vh - 120px))",
        maxHeight: "calc(100vh - 120px)",
        border: "1px solid rgba(0,0,0,0.1)",
        animation: "slideUp 0.35s cubic-bezier(.22,.61,.36,1)"
      }}
        >
          <style>{`
            @keyframes slideUp { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
            .chat-scroll::-webkit-scrollbar { width: 4px; }
            .chat-scroll::-webkit-scrollbar-track { background: transparent; }
            .chat-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
            .quick-chips::-webkit-scrollbar { display: none; }
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
          `}</style>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #071a0b 0%, #0f3318 50%, #1a5c2a 100%)" }}
            className="px-4 py-3.5 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
              🌿
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm tracking-wide">PP Explorer</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "blink 2s infinite" }} />
                <span className="text-emerald-300/80 text-[11px]">Pollachi & Palani Travel Guide</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 chat-scroll"
            style={{ background: "linear-gradient(180deg, #f0f5f1 0%, #f7f9f7 100%)" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                {m.from === "bot" && (
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs mb-4"
                    style={{ background: "linear-gradient(135deg, #0c3d1a, #1a6b30)" }}>
                    🌿
                  </div>
                )}
                <div className={`max-w-[80%] ${m.from === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm"
                    style={m.from === "user"
                      ? { background: "linear-gradient(135deg, #0c3d1a, #1a6b30)", color: "white", borderRadius: "18px 18px 4px 18px" }
                      : { background: "white", color: "#1a1a1a", borderRadius: "4px 18px 18px 18px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }
                    }>
                    <RenderText text={m.text} />
                    {m.streaming && <span style={{ animation: "blink 0.8s infinite", marginLeft: "2px" }}>▌</span>}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {isTyping && messages[messages.length - 1]?.from !== "bot" && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs"
                  style={{ background: "linear-gradient(135deg, #0c3d1a, #1a6b30)" }}>🌿</div>
                <div className="bg-white px-4 py-3 shadow-sm flex gap-1.5 items-center"
                  style={{ borderRadius: "4px 18px 18px 18px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  {[0,1,2].map(j => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"
                      style={{ animationDelay: `${j*0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies with arrow scroll buttons */}
          <div className="shrink-0" style={{ background: "white", borderTop: "1px solid #f0f0f0", position: "relative", display: "flex", alignItems: "center", gap: "4px", padding: "8px 8px" }}>
            {/* Left arrow */}
            <button
              onClick={() => chipsRef.current && (chipsRef.current.scrollLeft -= 120)}
              style={{ flexShrink: 0, width: "26px", height: "26px", borderRadius: "50%", border: "1px solid #c6e8cc", background: "#f0faf2", color: "#0c3d1a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
              ‹
            </button>

            {/* Scrollable chips */}
            <div ref={chipsRef} style={{ overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", msOverflowStyle: "none", flex: 1, scrollBehavior: "smooth" }}>
              <div style={{ display: "flex", gap: "8px", width: "max-content", padding: "2px 0" }}>
                {QUICK_REPLIES.map(q => (
                  <button key={q.msg} onClick={() => sendMessage(q.msg)} disabled={isTyping}
                    style={{ background: "#f0faf2", color: "#0c3d1a", border: "1px solid #c6e8cc", whiteSpace: "nowrap", borderRadius: "99px", padding: "6px 12px", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", opacity: isTyping ? 0.4 : 1, flexShrink: 0 }}>
                    <span>{q.icon}</span>{q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => chipsRef.current && (chipsRef.current.scrollLeft += 120)}
              style={{ flexShrink: 0, width: "26px", height: "26px", borderRadius: "50%", border: "1px solid #c6e8cc", background: "#f0faf2", color: "#0c3d1a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
              ›
            </button>
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex gap-2 shrink-0"
            style={{ background: "white", borderTop: "1px solid #f0f0f0" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !isTyping && sendMessage(input)}
              placeholder="Ask about places, stays, timings..."
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all disabled:opacity-50"
              style={{ border: "1.5px solid #e5e7eb", background: "#fafafa", fontSize: "13px" }}
              onFocus={e => e.target.style.borderColor = "#1a6b30"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 shrink-0"
              style={{ background: "linear-gradient(135deg, #0c3d1a, #1a6b30)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
