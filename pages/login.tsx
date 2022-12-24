/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import { Auth, ThemeMinimal, ThemeSupa } from '@supabase/auth-ui-react'
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

  const style = {
    textAlign: "center" as const,
    margin: "0 15px",
  }

  const logoStyle = {
    marginTop: "20px"
  }

  const redirectLinkStyle = {
    marginBottom: "100px",
    display: "block",
    textDecoration: "underline",
  }


  if (!loading && !user){
    return (
      <div style={style}>
        <img style={logoStyle} src="/SeaHorseText.svg" />

        <Auth
          redirectTo="https://seahorse-blue.vercel.app/"
          appearance={{ theme: ThemeMinimal }}
          supabaseClient={supabaseClient}
          socialLayout="horizontal"
        />

        <a style={redirectLinkStyle} href="https://seahorse-blue.vercel.app/">If redirect fails...</a>
        <p>"There's virtually no limit to how much learning we can remember as long as we relate it to what we already know." -Peter C. Brown</p>
      </div>
    )
  }
}