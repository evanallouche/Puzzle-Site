import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  useEffect(()=>{
    supabase.auth.getSession().then(({ data: { session } }) => {
      if(!session) return;
      const destination = session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
        ? '/admin'
        : '/puzzle1';
      window.location.href = destination;
    });
  }, []);

  async function signIn(e){
    e.preventDefault();
    setErr('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error){ setErr(error.message); return; }
    const destination = data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
      ? '/admin'
      : '/puzzle1';
    window.location.href = destination;
  }

  return (
    <div className="wrap">
      <div className="card">
        <h1>HAMOSADNIKIM</h1>
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
