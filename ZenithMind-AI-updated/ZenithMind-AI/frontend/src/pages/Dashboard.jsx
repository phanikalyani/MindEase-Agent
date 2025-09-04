import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard({ session }){
  const [userId, setUserId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [connectUrl, setConnectUrl] = useState(null);

  useEffect(() => {
    // Upsert user on backend
    api.post('/user/upsert', {
      name: session.name,
      email: session.email,
      descopeUserId: session.descopeUserId
    }).then(r => setUserId(r.data.userId));
  }, []);

  const connectGoogle = async () => {
    const r = await api.get('/auth/connect/google');
    window.location.href = r.data.url; // redirect to Descope hosted connect flow
  };

  const getSuggestions = async () => {
    const r = await api.post('/calendar/suggest', {
      userId, descopeUserId: session.descopeUserId
    });
    setSuggestions(r.data.suggestions || []);
  };

  const schedule = async (sug) => {
    await api.post('/calendar/schedule', {
      userId, descopeUserId: session.descopeUserId, suggestion: sug
    });
    alert('Scheduled in Google Calendar (check your calendar)');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {session.name}</h1>
        <button className="btn btn-primary" onClick={connectGoogle}>Connect Google Calendar</button>
      </header>

      <div className="card">
        <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>
        <p className="text-sm text-gray-600 mb-4">Get suggested wellness breaks & focus blocks for today.</p>
        <button className="btn btn-primary" onClick={getSuggestions}>Generate Suggestions</button>

        <div className="mt-4 space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-gray-600">{s.type} • {new Date(s.start).toLocaleTimeString()} - {new Date(s.end).toLocaleTimeString()}</div>
              </div>
              <button className="btn btn-primary" onClick={() => schedule(s)}>Schedule</button>
            </div>
          ))}
          {suggestions.length === 0 && <div className="text-sm text-gray-500">No suggestions yet.</div>}
        </div>
      </div>
    </div>
  );
}
