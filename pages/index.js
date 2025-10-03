import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session) window.location.href = '/puzzle1';
    });
  }, []);

  async function signIn(e){
    e.preventDefault();
    setErr('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); return; }
    window.location.href = '/puzzle1';
  }

  return (
    <div className="wrap">
      <div className="card">
        <h1>🧩 Puzzle Challenge</h1>
        <p className="small">Log in with your pre-created account.</p>
        <form onSubmit={signIn}>
          <div className="answer">
            <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="answer">
            <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit">Enter</button>
        </form>
        {err && <div className="feedback">⚠️ {err}</div>}
      </div>
    </div>
  );
}
