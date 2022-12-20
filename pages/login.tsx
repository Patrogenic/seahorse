import Head from 'next/head'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Login(){
  const supabaseClient = useSupabaseClient()
  // const user = useUser()
  const [ user, setUser ] = useState<User>();
  const [data, setData] = useState<any[] | null>()
  const router = useRouter();
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    async function testData(){
      const res = await supabaseClient.auth.getUser();
      if(res?.data?.user){
        setUser(res?.data?.user);
        router.push("https://seahorse-blue.vercel.app/");
      }
      setLoading(false);
    }

    testData();
  }, []);


  if (!loading && !user){
    return (
      <Auth
        redirectTo="https://seahorse-blue.vercel.app/"
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        socialLayout="horizontal"
      />
    )
  }
}