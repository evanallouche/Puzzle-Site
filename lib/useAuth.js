import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useUser(redirectIfNoUser=true){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const run = async ()=>{
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      if(redirectIfNoUser && !session?.user){
        window.location.href = '/';
      }
    };
    run();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session)=>{
      setUser(session?.user ?? null);
      if(redirectIfNoUser && !session?.user){ window.location.href = '/'; }
    });
    return ()=> sub.subscription.unsubscribe();
  }, [redirectIfNoUser]);
  return { user, loading };
}
