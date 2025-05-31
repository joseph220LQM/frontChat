import { useState, useEffect } from 'react';
import { sendMessage } from '../services/api';

export default function ChatPage({ user }) {
  const { name, studentId, email } = user;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/chat/history/${email}`);
    if (!res.ok) throw new Error('No se pudo cargar el historial');
    const data = await res.json();
    if (data.messages) {
      setMessages(data.messages);
    }
  } catch (error) {
    console.error('Error al cargar historial:', error);
  }
};


  useEffect(() => {
    if (email) fetchHistory();
  }, [email]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage({ name, studentId, email, message: input });
      const botMsg = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Hubo un error al procesar tu mensaje.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/chat/send-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) alert('Historial enviado a tu correo.');
      else alert('Error al enviar el historial.');
    } catch {
      alert('Error al enviar el historial.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow p-4 text-xl font-semibold text-indigo-700">
        Hola, {name}
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-gray-500 italic">Mente Clara está escribiendo...</div>
        )}
      </div>

      <footer className="p-4 bg-white flex gap-2 flex-col sm:flex-row">
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="¿Cómo te sientes hoy?"
        />
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Enviar
          </button>
          <button
            onClick={handleSendHistory}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Enviar historial por correo
          </button>
        </div>
      </footer>
    </div>
  );
}


