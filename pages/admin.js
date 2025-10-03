import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/useAuth';

export default function Admin(){
  const { user } = useUser(true);
  const [rows, setRows] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [err, setErr] = useState('');

  useEffect(()=>{
    const run = async ()=>{
      if(!user) return;
      if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL){
        window.location.href = '/'; return;
      }
      const { data: prog, error: e1 } = await supabase.from('progress').select('*').order('completed_at', { ascending: true });
      const { data: att, error: e2 } = await supabase.from('attempts').select('*').order('attempted_at', { ascending: false }).limit(200);
      if(e1||e2){ setErr((e1||e2).message); return; }
      setRows(prog||[]); setAttempts(att||[]);
    };
    run();
  }, [user]);

  return (
    <div className="wrap">
      <div className="card" style={{textAlign:'left'}}>
        <h1>Admin</h1>
        {err && <div className="feedback">⚠️ {err}</div>}
        <h3>Progress</h3>
        <pre className="small">{JSON.stringify(rows,null,2)}</pre>
        <h3>Recent Attempts</h3>
        <pre className="small">{JSON.stringify(attempts,null,2)}</pre>
      </div>
    </div>
  );
}
