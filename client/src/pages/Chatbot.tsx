import React, { useState } from 'react';
import { sendChatbotMessage } from '../api/axios';

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ sender: string, text: string }[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setChat([...chat, { sender: 'You', text: message }]);
    try {
      const res = await sendChatbotMessage(message);
      setChat(prev => [...prev, { sender: 'Spiriter', text: res.data.response }]);
    } catch (err) {
      setChat(prev => [...prev, { sender: 'Spiriter', text: 'Error communicating with chatbot' }]);
    }
    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Spiriter Chatbot</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-4">
        {chat.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
