'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Uzenofal() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => { fetchMessages(); }, []);

  const saveMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    await supabase.from('messages').insert([{ content: newMessage }]);
    setNewMessage('');
    await fetchMessages();
    setLoading(false);
  };

  const deleteMessage = async (id: number) => {
    await supabase.from('messages').delete().eq('id', id);
    fetchMessages();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Facebook Kék Fejléc */}
      <header className="bg-[#1877F2] text-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Messagebox</h1>
          <div className="text-sm font-medium">Üzenőfal Projekt</div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Beviteli mező (Kártya stílus) */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <textarea 
            className="w-full border-none focus:ring-0 text-lg resize-none text-black placeholder-gray-500" 
            rows={3}
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mi jár a fejedben?"
          />
          <hr className="my-3" />
          <div className="flex justify-end">
            <button 
              onClick={saveMessage} 
              disabled={loading}
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold px-8 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </div>

        {/* Üzenetek listája */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-900 text-base leading-relaxed">{msg.content}</p>
                  <span className="text-xs text-gray-500 block mt-2">
                    {new Date(msg.created_at).toLocaleString('hu-HU')}
                  </span>
                </div>
                <button 
                  onClick={() => deleteMessage(msg.id)} 
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="Törlés"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Link19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <p className="text-center text-gray-500 py-10">Még nincsenek üzenetek az üzenőfalon.</p>
          )}
        </div>
      </main>
    </div>
  );
}