import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App(){
  const [session, setSession] = useState(null);

  if (!session) return <Login onLogin={setSession} />;
  return <Dashboard session={session} />;
}
