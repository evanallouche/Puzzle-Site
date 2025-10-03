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
      <div class="card"><div class="pad">
              <div class="poem" id="poem">
<p>Hugurinn snýr til bókar sem geymir svör.</p>
  <p>Tunglskinið lýsir upp þakkarorðin í bókinni.</p>
  <p>Tíminn minnir á upphaf orðanna.</p>
  <p>Pílagrímar finna sannleikann þar.</p>
  <p>Sjáðu hvernig fyrstu orð leiða áfram.</p>

  <p>://</p>

  <p>Túlkun felst í fyrstu stafnum.</p>
  <p>Iðandi kraftur er falinn í upphafi.</p>
  <p>Nafnlausir stafir bera dulinn skilaboð.</p>
  <p>Yfirborðið hylur en upphafið afhjúpar.</p>
  <p>Upphafið er lykill að vegi óséðum.</p>
  <p>Raddir hvísla að byrjunin er lykillinn.</p>
  <p>Ljós birtist í fyrsta bókstafnum.</p>

  <p>.</p>

  <p>Cíklur myndast úr upphafi.</p>
  <p>Orðin sem hefjast móta veginn.</p>
  <p>Málsgrein og stafur verða að brú.</p>
  <p>/</p>
  <p>2 leiðir sameinast í byrjun.</p>
  <p>Dularfull tákn tengjast í einingu.</p>
  <p>Allt sem byrjar, teiknar kort.</p>
  <p>Wandarar finna hlekkinn í fyrstu stöfunum.</p>
  <p>4 er númer liðsins.</p>
  <p>8 eru vikurnar sem eftir eru.</p>
  <p>Zóarandi runur sýna áttina.</p>
  <p>Beygðu augun niður fyrstu stafi — þar er slóðin.</p>
      </div>
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
