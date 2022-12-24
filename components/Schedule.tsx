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

const Schedule = ({ books }: ScheduleProps) => {
  const scheduleMap: ScheduleMap = books && buildScheduleMap(books) || {};



  // Next steps:
  // Should look at implementing fullscreen
  // To put it simply: I need to figure out fullscreen mode and also fix the style everywhere in the app

  // Hamburger menu
  // Style login screen to mostly match the design mock
  // Style the search bar and buttons the BookList screen
  // Style buttons through the rest of the application (make a general button style to be used, maybe in the global css file)

  // Later steps:
  // Test out with another user to test row level security
  // Explore custom PDF viewer (might need to go as far as parsing a PDF and displaying the content myself)
  // Reorganize code, clean code
  // Write unit tests
  // Write E2E tests

  return(
    <div className={styles.ctn}>
      {Object.keys(scheduleMap).map((date, i) => <div key={i}>
        <div className={styles.dates}>{date}</div>
        {scheduleMap[date].map((book, j) => <div key={j}>
          {book}
        </div>)}
      </div>)}

    </div>
  )
}

export default Schedule;