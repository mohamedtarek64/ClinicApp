import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am Healix AI. How can I help you today?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // سكرول تلقائي لآخر رسالة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        text: "I'm analyzing your symptoms. Please wait a moment...", 
        sender: "ai" 
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    // استخدام var(--bg-app) للخلفية الأساسية
    <div className="flex flex-col h-screen bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-300">
      
      {/* Header الشات - متصل بالثيم */}
      <div className="bg-[var(--bg-card)] border-b-2 border-[var(--border)] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/home")} 
            className="p-2 hover:bg-[var(--bg-app)] rounded-full transition-all text-[var(--text-sub)]"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B8ED9] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FaRobot size={22} />
            </div>
            <div>
              <h2 className="font-black leading-tight uppercase tracking-tight">HEALIX AI</h2>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online & Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                msg.sender === "user" ? "bg-[var(--text-main)]" : "bg-[#0B8ED9]"
              }`}>
                {msg.sender === "user" ? <FaUser size={12} /> : <FaRobot size={12} />}
              </div>
              
              {/* فقاعة الكلام - متصلة بالثيم */}
              <div className={`p-4 rounded-2xl border-2 font-bold text-sm shadow-sm transition-all ${
                msg.sender === "user" 
                ? "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-main)] rounded-tr-none" 
                : "bg-[#0B8ED9] border-black text-white rounded-tl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الإدخال (Input) بنفس ستايل الفورم في الـ Home */}
      <div className="p-4 bg-[var(--bg-card)] border-t-2 border-[var(--border)] pb-8">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            className="w-full py-4 pl-6 pr-16 bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-2xl outline-none focus:border-[#0B8ED9] transition-all font-bold text-[var(--text-main)] placeholder:text-[var(--text-sub)]"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B8ED9] text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-md active:scale-90"
          >
            <FaPaperPlane size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-[var(--text-sub)] mt-3 font-bold uppercase tracking-tighter opacity-60">
          AI can make mistakes. Please consult a professional doctor.
        </p>
      </div>
    </div>
  );
}