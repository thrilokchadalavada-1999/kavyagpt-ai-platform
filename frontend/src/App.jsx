import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaRobot,
  FaPlus,
} from "react-icons/fa";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message || loading) return;

    const userMessage = {
      type: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {

      const response = await axios.post(
        "/api/chat",
        {
          message: currentMessage,
        }
      );

      const botMessage = {
        type: "bot",
        text: response.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);

    } catch (error) {

      const errorMessage = {
        type: "bot",
        text: "⚠ kavya is having trouble responding. Please try again.",
      };

      setChat((prev) => [...prev, errorMessage]);

    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setChat([]);
  };

  return (

    <div className="flex h-screen bg-slate-950 text-white">

      <div className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-5 flex flex-col">

        <div className="flex items-center gap-3 text-2xl font-bold text-cyan-400 mb-8">
          <FaRobot />
          KavyaGPT
        </div>

        <button
          onClick={newChat}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 px-4 py-3 rounded-xl font-semibold"
        >
          <FaPlus />
          New Chat
        </button>

        <div className="mt-10 text-sm text-gray-400">
          AI DevOps Assistant
        </div>

      </div>

      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-y-auto p-10 space-y-6">

          {chat.length === 0 && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center"
            >

              <div className="text-6xl mb-6 text-cyan-400">
                <FaRobot />
              </div>

              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                KavyaGPT
              </h1>

              <p className="text-gray-400 text-lg">
                Your AI Powered DevOps Assistant
              </p>

            </motion.div>
          )}

          {chat.map((msg, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-3xl p-5 rounded-2xl shadow-2xl ${
                msg.type === "user"
                  ? "ml-auto bg-cyan-500 text-white"
                  : "bg-white/10 backdrop-blur-lg border border-white/10"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}

          {loading && (

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
              }}
              className="bg-white/10 w-fit px-5 py-4 rounded-2xl"
            >
              ⚡ KavyaGPT is thinking...
            </motion.div>
          )}

        </div>

        <div className="p-6 border-t border-white/10 bg-slate-950">

          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl">

            <input
              type="text"
              placeholder="Ask KavyaGPT anything..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-lg"
            />

            <button
              onClick={sendMessage}
              className="bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 p-4 rounded-xl"
            >
              <FaPaperPlane />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;