import { Book } from "./types";


const templateBook = {
  id: 1,
  created_at: "created_at",
  quiz: "Chapter 1: Trouble",
  notes: "notes",
  pdf_filename: "pdf_filename",
  email: "email",
  book_title: "book1",
  author: "author",
  published_date: "published_date",
  next_quiz_date: "12/23/22",
  quiz_cooldown_time: 1,
}

const Books: Book[] = [
  { ...templateBook },
  { ...templateBook, next_quiz_date: "12/24/22", book_title: "book2", id: 2 },
  { ...templateBook, next_quiz_date: "12/25/22", book_title: "book3", id: 3 },
  { ...templateBook, next_quiz_date: "12/26/22", book_title: "book4", id: 4 },
  { ...templateBook, next_quiz_date: "12/25/22", book_title: "book5", id: 5 },



]

export default Books;