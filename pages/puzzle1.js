import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { sha256Hex, normalize } from '@/lib/hash';
import { useUser } from '@/lib/useAuth';

export default function Puzzle(){
  const { user, loading } = useUser(true);
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState('');
  useEffect(()=>{ document.title = 'Puzzle 1'; }, []);

  async function submit(){
    const val = normalize(ans);
    const h = await sha256Hex(val);
    const correct = (h === '5caa5c3dc5f7069ec9cd58a64cf0598a45f927acaf8211dfbe9d0d98a7479ef3');
    // log attempt
    if(user){
      await supabase.from('attempts').insert([{ user_id: user.id, stage: 1, answer: val, correct }]);
      if(correct){
        await supabase.from('progress').upsert([{ user_id: user.id, stage: 1 }], { onConflict: 'user_id,stage' });
      }
    }
    if(correct){
      window.location.href = '/puzzle2';
    } else {
      setFb('❌ Not quite.');
    }
  }

  return (
    <div className="wrap">
      <div className="card">
        <img src="/Capture.JPG" alt="Puzzle 1" />
    <div style={{
  background: "#fff",
  color: "#fff",
  fontSize: "1px",
  textAlign: "center",
  marginTop: "8px",
  overflow: "hidden"
}}>
  https://upload.wikimedia.org/wikipedia/commons/3/36/Pigpen_cipher_key.svg
</div>

        <div className="answer">
          <input id="ans" placeholder="Answer" value={ans} onChange={e=>setAns(e.target.value)} />
          <button id="go" onClick={submit}>Submit</button>
        </div>
        <div className="feedback">{fb}</div>
      </div>
    </div>
  );
}
