import React, { useState, useEffect, useRef } from 'react';

// --- SVG Icon Components ---
const SparklesIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 15.75z" />
    </svg>
);
const SendIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);


// --- Main App Component ---
export default function App() {
    const [currentMessage, setCurrentMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Automatically scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!currentMessage || isLoading) return;

        const userMessage = { role: "user", text: currentMessage };
        const newChatHistory = [...chatHistory, userMessage];
        setChatHistory(newChatHistory);
        setCurrentMessage('');
        setIsLoading(true);

        try {
            // Format the history for the Gemini API
            const apiChatHistory = newChatHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const payload = { contents: apiChatHistory };
            const apiKey = "AIzaSyAcpjOGvynmtjhZzkevf_Np9_Nr0DOIxkg";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!apiResponse.ok) {
                throw new Error(`API error: ${apiResponse.statusText}`);
            }

            const result = await apiResponse.json();
            
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const modelResponse = { role: "model", text: result.candidates[0].content.parts[0].text };
                setChatHistory(prev => [...prev, modelResponse]);
            } else {
                throw new Error("Unexpected response format from the API.");
            }

        } catch (err) {
            console.error("Failed to generate response:", err);
            const errorMessage = { role: "model", text: "Sorry, something went wrong. Please try again." };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 shadow-md p-4 text-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold flex items-center justify-center">
                    <SparklesIcon className="h-8 w-8 mr-3 text-cyan-400" />
                    AI Chatbot by vishal raj 
                </h1>
            </header>

            {/* Chat Window */}
            <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-lg p-3 rounded-lg ${message.role === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-lg p-3 rounded-lg bg-gray-700">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Message Input Form */}
            <footer className="bg-gray-800 p-4 sticky bottom-0">
                <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center space-x-2">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !currentMessage}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold p-3 rounded-md transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <SendIcon className="h-6 w-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
}
