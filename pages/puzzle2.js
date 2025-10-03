import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { sha256Hex, normalize } from '@/lib/hash';
import { useUser } from '@/lib/useAuth';

export default function Puzzle(){
  const { user, loading } = useUser(true);
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState('');
  useEffect(()=>{ document.title = 'Puzzle 2'; }, []);

  async function submit(){
    const val = normalize(ans);
    const h = await sha256Hex(val);
    const correct = (h === '0aca64a564599737c6f25f10d4c63e8afc6b0bd6f45aacf1ed5456d7eabba692');
    // log attempt
    if(user){
      await supabase.from('attempts').insert([{ user_id: user.id, stage: 2, answer: val, correct }]);
      if(correct){
        await supabase.from('progress').upsert([{ user_id: user.id, stage: 2 }], { onConflict: 'user_id,stage' });
      }
    }
    if(correct){
      window.location.href = '/puzzle3';
    } else {
      setFb('❌ Not quite.');
    }
  }

  return (
    <div className="wrap">
      <div className="card">
        <p>A mysterious poem appears… decipher it to continue.</p>
        <div className="answer">
          <input id="ans" placeholder="Answer" value={ans} onChange={e=>setAns(e.target.value)} />
          <button id="go" onClick={submit}>Submit</button>
        </div>
        <div className="feedback">{fb}</div>
      </div>
    </div>
  );
}
