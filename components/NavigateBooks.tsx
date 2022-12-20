import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Book } from "../types";
import BookDetails from "./BookDetails";
import BookTile from "./BookTile";
import BookTileList from "./BookTileList";
import NotesTab from "./NotesTab";
import PDFTab from "./PDFTab";
import QuizTab from "./QuizTab";


type NavigateBooksProps = {
  books: Book[] | null,
  setBooks: (books: Book[]) => void,
}

type Property = "quiz" | "notes" | "pdf_filename";

const NavigateBooks = ({ books, setBooks }: NavigateBooksProps) => {
  const supabaseClient = useSupabaseClient();
  const [ currBookIndex, setCurrBookIndex ] = useState<number>(-1);
  const [ search, setSearch ] = useState<string>("");
  const filteredBooks = books;
  const currBook: Book | null = books && currBookIndex !== 1 ? books[currBookIndex] : null;

  // const setQuiz = (quiz: string): void => {
  //   let updatedBook: Book = { ...currBook, quiz } as Book;
  //   let updatedBooks: Book[] = books!.map((b, i) => i === currBookIndex ? updatedBook : b)

  //   //update Supabase and then update books locally
  //   setBooks(updatedBooks);
  // }


  const setBookProperty = async (prop: Property, value: string): Promise<void> => {
    let updatedBook: Book = { ...currBook, [prop]: value } as Book;
    let updatedBooks: Book[] = books!.map((b, i) => i === currBookIndex ? updatedBook : b)
    
    const { data } = await supabaseClient.from('Books').update({ [prop]: value }).eq('id', currBook?.id)

    console.log(data);
    //update row in Supabase and then update books locally
    setBooks(updatedBooks);
  }

  return(
    <>
      

      {!currBook && <>
        <input type="text" />
        <BookTileList>
          {filteredBooks?.map((b, i) => <BookTile key={b.id} title={b.book_title} setCurrBookIndex={setCurrBookIndex} bookIndex={i} />)}
        </BookTileList></>
      }
      {currBook && <BookDetails
        quizTab={<QuizTab setQuiz={(quiz) => setBookProperty("quiz", quiz)} />}
        notesTab={<NotesTab setNotes={(notes) => setBookProperty("notes", notes)}/>}
        pdfTab={<PDFTab pdf_filename={currBook.pdf_filename} setPDF={(pdf_filename) => setBookProperty("pdf_filename", pdf_filename)}/>}/>
      }
    </>
  )
}

export default NavigateBooks;