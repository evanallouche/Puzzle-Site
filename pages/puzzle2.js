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
Hugurinn snýr til bókar sem geymir svör.
Tunglskinið lýsir upp þakkarorðin í bókinni.
Tíminn minnir á upphaf orðanna.
Pílagrímar finna sannleikann þar.
Sjáðu hvernig fyrstu orð leiða áfram.

:
//

Túlkun felst í fyrstu stafnum.
Iðandi kraftur er falinn í upphafi.
Nafnlausir stafir bera dulinn skilaboð.
Yfirborðið hylur en upphafið afhjúpar.
Upphafið er lykill að vegi óséðum.
Raddir hvísla að byrjunin er lykillinn.
Ljós birtist í fyrsta bókstafnum.

.

Cíklur myndast úr upphafi.
Orðin sem hefjast móta veginn.
Málsgrein og stafur verða að brú.
/
2 leiðir sameinast í byrjun.
Dularfull tákn tengjast í einingu.
Allt sem byrjar, teiknar kort.
Wandarar finna hlekkinn í fyrstu stöfunum.
4 er númer liðsins.
8 eru vikurnar sem eftir eru.
Zóarandi runur sýna áttina.
Beygðu augun niður fyrstu stafi — þar er slóðin.
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
