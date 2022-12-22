import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { resolve } from "node:path/posix";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../pages";
import Books from "../testData";
import { Book, Views } from "../types";
import BookDetails from "./BookDetails";
import BookTile from "./BookTile";
import BookTileList from "./BookTileList";
import NavBar from "./NavBar";
import NavigateBooks from "./NavigateBooks";
import NotesTab from "./NotesTab";
import PDFTab from "./PDFTab";
import QuizTab from "./QuizTab";


type DashboardProps = {

}

type Property = "quiz" | "notes" | "pdf_filename" | "book_title";


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
      console.log(data)
      setBooks(data)
    }
    
    getBooks();
  }, [])

  const setBookProperty = async (prop: Property, value: string, originalBook: Book): Promise<void> => {
    let updatedBook: Book = { ...originalBook, [prop]: value } as Book;
    let updatedBooks: Book[] = books!.map((b, i) => b.id === originalBook.id ? updatedBook : b)
    
    const { data } = await supabaseClient.from('Books').update({ [prop]: value }).eq('id', originalBook.id)
    setBooks(updatedBooks);
  }

  const addNewBook = async () => {
    let book_title: string = prompt("New book:") || "";

    const res = await supabaseClient.from('Books').insert({ book_title, email: user.email })
    const { data } = await supabaseClient.from('Books').select('*').eq("book_title", book_title);

    // @ts-ignore
    setBooks([data[0], ...books])
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  }

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  //Need edit and delete icons, need to align them to the right, need to add style to my cards and make them look more like my design
  //Implement search

  // do notes screen, including adding links to the PDF (onload for the notes screen get the URL? or maybe I should just get the URL when I load bookdetails)
  // (current plan is to get the URL once on load and then append page numbers to the end of that link)

  //probably want the dashboard to get a PDF link from Supabase when someone clicks on a book
  //this will probably minimize the requests to supabase

  return(
    <>
      <NavBar currView={currView} setCurrView={setCurrView} />

      {!currBook && <>
        <input type="text" value={search} onChange={(e) => onSearchChange(e)} /> <button onClick={addNewBook}>New</button><button onClick={toggleEditMode}>Edit</button>
        <BookTileList>
          {filteredBooks?.map((b, i) => <BookTile key={b.id} title={b.book_title} onBookClick={() => onBookClick(b.id, b.pdf_filename)}
             dashboardEditMode={isEditMode} setBookTitle={(book_title) => setBookProperty("book_title", book_title, b)} />)}
        </BookTileList></>
      }
      {currBook && <BookDetails
        quizTab={<QuizTab quiz={currBook.quiz} setQuiz={(quiz) => setBookProperty("quiz", quiz, currBook)} />}
        notesTab={<NotesTab PDFUrl={currPDFUrl} notes={currBook.notes} setNotes={(notes) => setBookProperty("notes", notes, currBook)}/>}
        pdfTab={<PDFTab PDFUrl={currPDFUrl} pdf_filename={currBook.pdf_filename} setPDF={(pdf_filename) => setBookProperty("pdf_filename", pdf_filename, currBook)}/>}/>
      }

      {/* <Schedule /> */}

    </>
  )
}

export default Dashboard;