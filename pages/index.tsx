import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { User, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const supabaseClient = useSupabaseClient()
  // const user = useUser()
  const [ user, setUser ] = useState<User>();

  const router = useRouter();
  const [ books, setBooks ] = useState<any[] | null>([]); // add type for books
  const [ loading, setLoading ] = useState<boolean>(true);


  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('Books').select('*')
      setBooks(data)

      console.log(data)

      // const res = await supabaseClient.storage.from("pdfs").createSignedUrl(`${user?.id}/book.pdf`, 3600);
      // console.log("pdfs", res)

      // if(res?.data?.signedUrl){
      //   window.open(res.data?.signedUrl + "#page=3");
      // }
      //I might be able to just load this in an iframe inside the app
      //Try that, and then work on stubbing some stuff and then deploying that to see what it would look like on my phone

    }

    async function getUser(){
      const res = await supabaseClient.auth.getUser();
      if(res?.data?.user){
        setUser(res?.data?.user);
        // loadData()
      }else{
        router.push("http://localhost:3000/login");
        setLoading(false);
      }
    }

    getUser();

  }, [])



  return (
    <>
      <Head>
        <title>SeaHorse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/SeaHorse.svg" />
      </Head>
      <main>

        <Dashboard />
        


      </main>
    </>
  )
}
