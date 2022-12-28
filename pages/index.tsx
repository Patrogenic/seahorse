import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { User, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'


const UserContext = createContext<User>({} as User);

export { UserContext }

export default function Home() {
  const supabaseClient = useSupabaseClient()
  const [ user, setUser ] = useState<User>({} as User);
  const router = useRouter();
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    async function getUser(){
      const res = await supabaseClient.auth.getUser();
      if(res?.data?.user){
        setUser(res?.data?.user);
      }else{
        router.push("https://seahorse-blue.vercel.app/login");
      }

      setLoading(false);
    }

    getUser();

  }, [])

  if(!loading){
    return (
      <>
      <Head>
        <title>SeaHorse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/SeaHorse.svg" />
      </Head>
      <main>

        <UserContext.Provider value={user}>
          <Dashboard />
        </UserContext.Provider>

      </main>
      </>
    )
  }
}
