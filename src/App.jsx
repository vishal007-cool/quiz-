import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Plus, 
  Send, 
  Settings, 
  MessageSquare, 
  X, 
  Sparkles, 
  User, 
  Bot,
  MoreVertical,
  Trash2,
  Moon,
  Sun,
  Code
} from 'lucide-react';

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    const storedHistory = localStorage.getItem('gemini_history');
    if (storedKey) setApiKey(storedKey);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setHistory(parsedHistory);
      // Start a new chat by default if history exists, or load the last one? 
      // Let's start fresh.
      startNewChat(); 
    } else {
      startNewChat();
    }
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDarkMode(false);
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem('gemini_history', JSON.stringify(history));
  }, [history]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setIsSettingsOpen(false);
  };

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newChat = { id: newId, title: 'New Chat', messages: [] };
    setHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newId);
    setMessages([]);
    setIsSidebarOpen(false);
    
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const loadChat = (chatId) => {
    const chat = history.find(h => h.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setIsSidebarOpen(false);
    }
  };

  const deleteChat = (e, chatId) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.id !== chatId);
    setHistory(newHistory);
    if (currentChatId === chatId) {
      if (newHistory.length > 0) {
        loadChat(newHistory[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const generateTitle = async (firstMessage, assistantResponse) => {
    // A simple heuristic for title generation to save API calls
    return firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      // Build the payload
      // Note: We are using the REST API directly. In a production Express app, 
      // this fetch would go to your backend (e.g., /api/chat) which would then call Google.
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: newMessages.map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            }))
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch response');
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
      
      const assistantMessage = { role: 'model', content: aiText };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Update History
      setHistory(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          // Update title if it's the first message
          const title = chat.messages.length === 0 
            ? (userMessage.content.length > 25 ? userMessage.content.substring(0, 25) + '...' : userMessage.content)
            : chat.title;
            
          return { ...chat, messages: updatedMessages, title };
        }
        return chat;
      }));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message}. Please check your API Key.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple Markdown-ish renderer
  const renderContent = (text) => {
    // Split code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeContent = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden bg-black/80 text-gray-200 text-sm font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-400">
              <span>Code</span>
              <button 
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-white"
              >
                Copy
              </button>
            </div>
            <div className="p-4 overflow-x-auto whitespace-pre">
              {codeContent}
            </div>
          </div>
        );
      }
      
      // Basic formatting for bold and paragraphs
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed">
          {part.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line.split(/(\*\*.*?\*\*)/g).map((chunk, j) => 
                chunk.startsWith('**') && chunk.endsWith('**') ? (
                  <strong key={j} className="font-bold text-blue-300">
                    {chunk.slice(2, -2)}
                  </strong>
                ) : (
                  <span key={j}>{chunk}</span>
                )
              )}
              {i < part.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      );
    });
  };

  // --- Themes ---
  const theme = isDarkMode ? {
    bg: 'bg-[#131314]',
    sidebar: 'bg-[#1e1f20]',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    inputBg: 'bg-[#1e1f20]',
    messageUser: 'bg-[#282a2c]',
    messageAi: 'bg-transparent',
    border: 'border-gray-700',
    hover: 'hover:bg-[#333537]',
  } : {
    bg: 'bg-white',
    sidebar: 'bg-gray-50',
    text: 'text-gray-800',
    textSecondary: 'text-gray-500',
    inputBg: 'bg-gray-100',
    messageUser: 'bg-gray-100',
    messageAi: 'bg-transparent',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-200',
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${theme.bg} ${theme.text} font-sans transition-colors duration-200`}>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${theme.sidebar} flex flex-col border-r ${theme.border}
      `}>
        <div className="p-4 flex items-center justify-between">
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden p-2 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Menu size={20} />
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">Gemini Clone</h1>
          <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className={`p-2 rounded-full ${theme.hover}`}
          >
             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="px-4 pb-4">
          <button 
            onClick={startNewChat}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full ${theme.hover} transition-colors border ${theme.border} ${isDarkMode ? 'bg-[#282a2c]' : 'bg-white'} shadow-sm`}
          >
            <Plus size={18} className="text-gray-400" />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          <div className={`px-4 py-2 text-xs font-medium ${theme.textSecondary}`}>Recent</div>
          {history.map(chat => (
            <div 
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`
                group flex items-center justify-between px-4 py-2 rounded-full cursor-pointer text-sm
                ${currentChatId === chat.id ? (isDarkMode ? 'bg-[#004a77] text-blue-100' : 'bg-blue-100 text-blue-800') : theme.hover}
              `}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare size={14} className={currentChatId === chat.id ? 'text-blue-200' : 'text-gray-500'} />
                <span className="truncate max-w-[140px]">{chat.title || 'New Chat'}</span>
              </div>
              <button 
                onClick={(e) => deleteChat(e, chat.id)}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-black/20`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className={`p-4 border-t ${theme.border}`}>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${theme.hover} text-sm`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${theme.textSecondary}`}>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header (Mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-full ${theme.hover}`}>
            <Menu size={24} />
          </button>
          <span className="font-medium">Gemini</span>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-20 py-6 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-80 mt-[-50px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-red-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                Hello, Human
              </h2>
              <p className={`max-w-md ${theme.textSecondary}`}>
                I'm a clone of Gemini. I can help you write code, plan your day, or just chat. Set your API key in settings to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-6 max-w-3xl mx-auto pb-24">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 flex-shrink-0 flex items-center justify-center mt-1">
                      <Sparkles size={16} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`
                    max-w-[85%] md:max-w-[80%] rounded-2xl px-5 py-3 
                    ${msg.role === 'user' ? theme.messageUser : theme.messageAi}
                  `}>
                    {msg.role === 'user' ? (
                       <p>{msg.content}</p>
                    ) : (
                       <div className="markdown-body">
                         {renderContent(msg.content)}
                       </div>
                    )}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                      <User size={16} className={isDarkMode ? 'text-blue-200' : 'text-blue-700'} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 flex-shrink-0 flex items-center justify-center animate-pulse">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`p-4 md:pb-6 md:pt-2 w-full max-w-4xl mx-auto ${theme.bg}`}>
          <div className={`
            relative flex items-end gap-2 rounded-3xl p-2 border transition-colors
            ${theme.inputBg} ${theme.border} focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20
          `}>
            <button className={`p-2 rounded-full ${theme.hover} ${theme.textSecondary} hidden md:block`}>
              <Plus size={20} />
            </button>
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini..."
              rows={1}
              className={`
                w-full max-h-32 bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 
                ${theme.text} placeholder-gray-500
              `}
            />
            
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`
                p-2 rounded-full mb-1 transition-all duration-200
                ${input.trim() 
                  ? 'bg-white text-black hover:bg-gray-200 shadow-md' 
                  : `${theme.hover} ${theme.textSecondary}`}
              `}
            >
              <Send size={18} className={input.trim() && "ml-0.5"} />
            </button>
          </div>
          <p className="text-center text-[10px] md:text-xs text-gray-500 mt-2">
            Gemini may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1e1f20] border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className={`p-1 rounded-full ${theme.hover}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>
                  Google API Key
                </label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API Key"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.inputBg} ${theme.border}`}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your key is stored locally in your browser. Get one at <a href="[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)" target="_blank" className="text-blue-400 underline">Google AI Studio</a>.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => saveApiKey(apiKey)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${isDarkMode ? '#333' : '#ddd'};
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}