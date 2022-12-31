import { Book } from "../types";
import styles from '../styles/Schedule.module.css'


type ScheduleProps = {
  books: Book[] | null,
}

type ScheduleMap = {
  [key: string]: string[]
}

const buildScheduleMap = (books: Book[]) => {
  let scheduleMap: ScheduleMap = {};

  for(let book of books){
    const next_quiz_date: string = book.next_quiz_date;

    if(!scheduleMap[next_quiz_date]){
      scheduleMap[next_quiz_date] = [];
    }

    scheduleMap[next_quiz_date].push(book.book_title);
  }

  return scheduleMap;
}

const sortDatesFn = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
}

const Schedule = ({ books }: ScheduleProps) => {
  const scheduleMap: ScheduleMap = books && buildScheduleMap(books) || {};



  // Next steps:

  // Hamburger menu
  // Style buttons through the rest of the application (make a general button style to be used, maybe in the global css file)
  // Might want to add some sort of indication that the PDF is in the process of being uploaded (this can take a while in some cases)
  // Will have to revise the UI of editing notes, it's currently somewhat of a hassle and inconvenient

  // Later steps:
  // Test out with another user to test row level security
  // Explore custom PDF viewer (might need to go as far as parsing a PDF and displaying the content myself)
  // Reorganize code, clean code
  // Write unit tests
  // Write E2E tests

  return(
    <div className={styles.ctn}>
      {Object.keys(scheduleMap).sort(sortDatesFn).map((date, i) => <div key={i}>
        <div className={styles.dates}>{date}</div>
        {scheduleMap[date].map((book, j) => <div key={j}>
          {book}
        </div>)}
      </div>)}

    </div>
  )
}

export default Schedule;