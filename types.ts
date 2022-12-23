

export type Book = {
  id: number,
  created_at: string,
  quiz: string,
  notes: string,
  pdf_filename: string,
  email: string,
  book_title: string,
  author: string,
  published_date: string,
  next_quiz_date: string,
  quiz_cooldown_time: number,
}

export type Views = "BookList" | "BookDetails" | "Schedule";