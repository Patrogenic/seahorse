import { useState, ChangeEvent } from "react";
import styles from '../styles/Quiz.module.css'

type QuizProps = {
  quiz: string,
  previewMode: boolean,
  saveNextQuizDate: (next_quiz_date: string, quiz_cooldown_time: number) => void
  quiz_cooldown_time?: number,
}

// 1 day, 2 days, 3 days, 1 week, 2 weeks, 1 month, 2 months, 3 months, 6 months (6 months will be the cap)
const quizSchedule = [0, 1, 2, 3, 7, 14, 30, 60, 90, 180, 0];
const romanNumArr = ["null", "I", "II", "III", "IV", "V", "VI", "VII"];

const Quiz = ({ quiz, previewMode, saveNextQuizDate, quiz_cooldown_time }: QuizProps) => {
  const lines: string[] = quiz.trim().split("\n");
  const parts: string[] | null = lines.filter(line => line.startsWith("Part"));
  const chapters: string[] | null = lines.filter(line => line.startsWith("Chapter"));
  const correctAnswers: string[] | null = lines.map(line => line.split(" ").slice(2).join(" "));
  const [ userAnswers, setUserAnswers ] = useState<string[]>(Array(lines.length).fill(""));
  const [ showAnswers, setShowAnswers ] = useState<boolean>(false);
  const cooldownIndex = quiz_cooldown_time && quizSchedule.indexOf(quiz_cooldown_time);
  const schedulingOptions: number[] = cooldownIndex !== undefined ? quizSchedule.slice(cooldownIndex - 1, cooldownIndex + 2) : [];

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val: string = e.target.value;
    let answersCopy = userAnswers.map((a, i) => i === index ? val : a);
    setUserAnswers(answersCopy)
  }

  const onQuizSubmit = () => {
    // reveal answers, then give the user the option to schedule the next quiz (give three options, if it was 3 days since the last quiz, give the user three options: 1 day, 3 days, 7 days)
    // then we have to update the schedules column in supabase
    console.log("quiz submitted")
    setShowAnswers(true);
  }

  const onSchedulingQuiz = (quiz_cooldown_time: number) => {
    const now = new Date();
    now.setDate(now.getDate() + quiz_cooldown_time);
    const nextQuizDate = now.toLocaleDateString();
    saveNextQuizDate(nextQuizDate, quiz_cooldown_time);
    resetQuiz();
  }

  const resetQuiz = () => {
    setShowAnswers(false);
  }


  // need to fix some styling for the notes and quiz, work on scheduling of quizzes, style login screen


  return(
    <div className={styles.ctn}>
      <div className={styles.quiz}>
        {parts.map((p, i) => <div className={styles.question} key={i}>
          <div>Part {romanNumArr[i + 1]}</div>
          <input className={styles.textInput} value={userAnswers[i]} onChange={(e) => onAnswerChange(e, i)} type="text"/>
          {showAnswers && <span>{correctAnswers[i]}</span>}
        </div>)}

        {chapters.map((c, i) => <div className={styles.question} key={i}>
          <div>Chapter {i + 1}</div>
          <input className={styles.textInput} value={userAnswers[i + parts.length]} onChange={(e) => onAnswerChange(e, i + parts.length)} type="text"/>
          {showAnswers && <span>{correctAnswers[i + parts.length]}</span>}
        </div>)}

        {!previewMode && <button onClick={onQuizSubmit}>Submit</button>}
        {showAnswers && <div>
          {schedulingOptions.map((s, i) => s !== 0 && <button key={i} onClick={() => onSchedulingQuiz(s)} >{s} days</button>)}
        </div>}
      </div>
    </div>
  )
}

export default Quiz;