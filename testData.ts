import { Book } from "./types";


const templateBook = {
  id: 1,
  created_at: "created_at",
  quiz: "quiz",
  notes: "notes",
  pdf_filename: "pdf_filename",
  email: "email",
  book_title: "book_title",
  author: "author",
  published_date: "published_date",
}

const Books: Book[] = [
  { ...templateBook }



]

export default Books;