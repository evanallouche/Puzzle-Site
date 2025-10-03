import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { sha256Hex, normalize } from '@/lib/hash';
import { useUser } from '@/lib/useAuth';

export default function Puzzle(){
  const { user, loading } = useUser(true);
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState('');
  useEffect(()=>{ document.title = 'Puzzle 4'; }, []);

  async function submit(){
    const val = normalize(ans);
    const h = await sha256Hex(val);
    const correct = (h === '2c6a891ceb9ad04d7ca7d38eb707525535e555fdf149a9efc6e2dcaeb8b17b9e');
    // log attempt
    if(user){
      await supabase.from('attempts').insert([{ user_id: user.id, stage: 4, answer: val, correct }]);
      if(correct){
        await supabase.from('progress').upsert([{ user_id: user.id, stage: 4 }], { onConflict: 'user_id,stage' });
      }
    }
    if(correct){
      window.location.href = '/congrats';
    } else {
      setFb('❌ Not quite.');
    }
  }

  return (
    <div className="wrap">
      <div className="card">
        <img src="/metadata.jpeg" alt="Puzzle 4" /><p className="small">Some images remember more than they show.</p>
        <div className="answer">
          <input id="ans" placeholder="Answer" value={ans} onChange={e=>setAns(e.target.value)} />
          <button id="go" onClick={submit}>Submit</button>
        </div>
        <div className="feedback">{fb}</div>
      </div>
    </div>
  );
}
