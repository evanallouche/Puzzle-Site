export async function sha256Hex(str){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
export function normalize(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]/g,''); }
