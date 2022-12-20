import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Books from "../testData";
import { Book } from "../types";
import BookDetails from "./BookDetails";
import NavBar from "./NavBar";
import NavigateBooks from "./NavigateBooks";


type DashboardProps = {

}

//conditionally show NavigateBooks/Schedule?
//or are these two things different routes?
//I can probably just keep everything in the dashboard for simplicity

//BookDetails will need to be passed functions to edit
const Dashboard = ({}: DashboardProps) => {
  const supabaseClient = useSupabaseClient()
  const [ books, setBooks ] = useState<Book[] | null>(null);

  useEffect(() => {
    async function getBooks() {
      const { data } = await supabaseClient.from('Books').select('*')
      console.log(data)
      setBooks(data)
    }
    
    getBooks();
  }, [])

  return(
    <>
      <NavBar />
      <NavigateBooks books={books} setBooks={setBooks}/>


    </>
  )
}

export default Dashboard;