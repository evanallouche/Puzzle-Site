import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { sha256Hex, normalize } from '@/lib/hash';
import { useUser } from '@/lib/useAuth';

export default function Puzzle(){
  const { user, loading } = useUser(true);
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState('');
  useEffect(()=>{ document.title = 'Puzzle 3'; }, []);

  async function submit(){
    const val = normalize(ans);
    const h = await sha256Hex(val);
    const correct = (h === 'a46e37632fa6ca51a13fe39a567b3c23b28c2f47d8af6be9bd63e030e214ba38');
    // log attempt
    if(user){
      await supabase.from('attempts').insert([{ user_id: user.id, stage: 3, answer: val, correct }]);
      if(correct){
        await supabase.from('progress').upsert([{ user_id: user.id, stage: 3 }], { onConflict: 'user_id,stage' });
      }
    }
    if(correct){
      window.location.href = '/puzzle4';
    } else {
      setFb('❌ Not quite.');
    }
  }

  return (
    <div className="wrap">
      <div className="card">
        <audio controls src="/convert.ing-now________SPECTOGRAM.wav" controlsList="download"></audio><p className="small">.</p>
        <div className="answer">
          <input id="ans" placeholder="Answer" value={ans} onChange={e=>setAns(e.target.value)} maxlength="2"/>
          <button id="go" onClick={submit}>Submit</button>
        </div>
        <div className="feedback">{fb}</div>
      </div>
    </div>
  );
}
