import React, { useState } from 'react';

/**
 * In a real app, render Descope's hosted widget / redirect flow.
 * Here we accept name/email/descopeUserId to create a local user.
 */
export default function Login({ onLogin }){
  const [form, setForm] = useState({ name:'', email:'', descopeUserId:'' });

  return (
    <div className="max-w-md mx-auto mt-24 card space-y-4">
      <h1 className="text-2xl font-bold">ZenithMind AI</h1>
      <p className="text-sm text-gray-600">Demo login (replace with Descope hosted flow in production)</p>

      <input className="w-full border rounded p-2" placeholder="Name"
        value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      <input className="w-full border rounded p-2" placeholder="Email"
        value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="w-full border rounded p-2" placeholder="Descope User ID"
        value={form.descopeUserId} onChange={e=>setForm({...form, descopeUserId:e.target.value})} />

      <button className="btn btn-primary w-full" onClick={()=> onLogin(form)}>Continue</button>
    </div>
  );
}
