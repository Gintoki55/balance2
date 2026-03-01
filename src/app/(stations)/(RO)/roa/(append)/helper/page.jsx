"use client";
import StationHeader from "@/components/stationheader";
import { useState, useRef, useEffect } from "react";

export default function HeplerPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // لتخزين المحادثة
  const chatEndRef = useRef(null);

  // تمرير الشاشة لأسفل عند إضافة رسالة جديدة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // أضف رسالة المستخدم
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    const userMessage = message;
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      console.log("ehre data:", data)

      // أضف رد AI
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      console.error(err);
          console.log("User message:", message);
    console.log("AI reply:", data.reply);
      setMessages((prev) => [...prev, { sender: "ai", text: "حدث خطأ في النظام" }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      <StationHeader title="Hepler" isPopup />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-900"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-300 flex gap-2">
        <textarea
          className="flex-1 border rounded-lg p-2 resize-none focus:outline-none focus:ring focus:border-blue-400"
          rows={1}
          placeholder="اكتب سؤالك هنا..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          send
        </button>
      </div>
    </div>
  );
}