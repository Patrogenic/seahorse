import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../pages";
import testData from "../testData";
import Books from "../testData";
import { Book, ChangedProperties, Property, Views } from "../types";
import BookDetails from "./BookDetails";
import BookTile from "./BookTile";
import BookTileList from "./BookTileList";
import NavBar from "./NavBar";
import NavigateBooks from "./NavigateBooks";
import NotesTab from "./NotesTab";
import PDFTab from "./PDFTab";
import QuizTab from "./QuizTab";
import Schedule from "./Schedule";
import styles from '../styles/Dashboard.module.css'


type DashboardProps = {

}




//conditionally show NavigateBooks/Schedule?
//or are these two things different routes?
//I can probably just keep everything in the dashboard for simplicity

const Dashboard = ({}: DashboardProps) => {
  const supabaseClient = useSupabaseClient()
  const user = useContext<User>(UserContext);
  const [ books, setBooks ] = useState<Book[] | null>(null);
  const [ currView, setCurrView ] = useState<Views>("BookList");
  const [ currBookId, setCurrBookId ] = useState<number>(-1);
  const [ currPDFUrl, setCurrPDFUrl ] = useState<string>("");
  const [ search, setSearch ] = useState<string>("");
  const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
  const filteredBooks = books?.filter(b => b.book_title.includes(search));
  const currBook: Book | null = filteredBooks && currView === "BookDetails" ? filteredBooks.filter(b => b.id === currBookId)[0] : null;

  useEffect(() => {
    async function getBooks() {
      const { data } = await supabaseClient.from('Books').select('*')

      data?.sort((a: Book, b: Book) => {
        if(a.created_at > b.created_at){
          return -1;
        }else{
          return 1;
        }
      })

      setBooks(data)
    }
    
    getBooks();
  }, [])

  const setBookProperty = async (prop: Property, value: string | number, originalBook: Book): Promise<void> => {
    let updatedBook: Book = { ...originalBook, [prop]: value } as Book;
    let updatedBooks: Book[] = books!.map((b, i) => b.id === originalBook.id ? updatedBook : b)
    
    const { data } = await supabaseClient.from('Books').update({ [prop]: value }).eq('id', originalBook.id)
    setBooks(updatedBooks);
  }

  const setBookProperties = async (changedProperties: ChangedProperties , originalBook: Book): Promise<void> => {
    let updatedBook: Book = { ...originalBook, ...changedProperties } as Book;
    let updatedBooks: Book[] = books!.map((b, i) => b.id === originalBook.id ? updatedBook : b)

    console.log(updatedBook);
    
    const { data } = await supabaseClient.from('Books').update({ ...changedProperties }).eq('id', originalBook.id)
    setBooks(updatedBooks);
  }

  const addNewBook = async () => {
    let book_title: string = prompt("New book:") || "";

    if(book_title){
      const res = await supabaseClient.from('Books').insert({ book_title, email: user.email })
      const { data } = await supabaseClient.from('Books').select('*').eq("book_title", book_title);
  
      // @ts-ignore
      setBooks([data[0], ...books])
    }
  }

  const getPDFUrl = async (pdf_filename: string): Promise<string> => {
    const hasPDF = pdf_filename?.includes(".pdf");

    if(hasPDF){
      const res = await supabaseClient.storage.from("pdfs").createSignedUrl(`${user.id}/${pdf_filename}`, 3600);
      
      if(res?.data?.signedUrl){
        return res?.data?.signedUrl;
      }
    }

    return "";
  }

  const onBookClick = async (id: number, pdf_filename: string) => {
    setCurrBookId(id);
    setCurrView("BookDetails");
    const PDFUrl = await getPDFUrl(pdf_filename);
    setCurrPDFUrl(PDFUrl);
  }

  const savePDF = async (pdf_filename: string, currBook: Book) => {
    await setBookProperty("pdf_filename", pdf_filename, currBook)
    const PDFUrl = await getPDFUrl(pdf_filename);
    setCurrPDFUrl(PDFUrl);
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  }

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return(
    <>
      <NavBar currView={currView} setCurrView={setCurrView} />

      {(currView === "BookDetails" || currView === "BookList") && <div>
        {!currBook && <>
          <div className={styles.actionBar}>
            <input type="text" value={search} onChange={(e) => onSearchChange(e)} />
            <div className={styles.btnCtn}>
              <button className={styles.btn} onClick={addNewBook}>New</button>
              <button className={styles.btn} onClick={toggleEditMode}>Edit</button>
            </div>
          </div>
          <BookTileList>
            {filteredBooks?.map((b, i) => <BookTile key={b.id} title={b.book_title} onBookClick={() => onBookClick(b.id, b.pdf_filename)}
              dashboardEditMode={isEditMode} setBookTitle={(book_title) => setBookProperty("book_title", book_title, b)} />)}
          </BookTileList></>
        }
        {currBook && <BookDetails
          quizTab={<QuizTab quiz={currBook.quiz || ""} notes={currBook.notes} quiz_cooldown_time={currBook.quiz_cooldown_time} saveQuiz={(quiz) => setBookProperty("quiz", quiz, currBook)} setBookProperties={(changedProperties) => setBookProperties(changedProperties, currBook)} />}
          notesTab={<NotesTab PDFUrl={currPDFUrl} notes={currBook.notes || ""} saveNotes={(notes) => setBookProperty("notes", notes, currBook)}/>}
          pdfTab={<PDFTab PDFUrl={currPDFUrl} pdf_filename={currBook.pdf_filename || ""} savePDF={(pdf_filename) => savePDF(pdf_filename, currBook)}/>}/>
        }
      </div>}

      {currView === "Schedule" && <Schedule books={books} />}

    </>
  )
}

export default Dashboard;