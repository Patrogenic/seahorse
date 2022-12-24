import { FocusEvent, MouseEvent, useEffect, useState } from "react";
import Quiz from "./Quiz";
import styles from '../styles/QuizTab.module.css'



// the user needs to be able to see this the preview, verify it looks fine, then save the quiz
// then we will pass the quiz to a Quiz component
const makeQuizFromNotes = (notes: string): string => {
  let quizFromNotes = "";
  const lines = notes.split("\n");

  for(let line of lines){
    if(line.startsWith("Chapter") || line.startsWith("Part")){
      quizFromNotes += line + '\n';
    }
  }

  quizFromNotes?.trim();

  return quizFromNotes;
}

type QuizTabProps = {
  saveQuiz: (quiz: string) => void,
  saveNextQuizDate: (next_quiz_date: string, quiz_cooldown_time: number) => void
  quiz: string,
  notes: string,
  quiz_cooldown_time: number,
}

const QuizTab = ({ saveQuiz, quiz, notes, saveNextQuizDate, quiz_cooldown_time }: QuizTabProps) => {
  const suggestMode = !quiz && notes ? true : false;
  const suggestedQuiz = suggestMode ? makeQuizFromNotes(notes) : "";
  const [ isEditMode, setIsEditMode ] = useState<boolean>(suggestMode);
  const [ editQuizVal, setEditQuizVal ] = useState<string>(suggestMode ? suggestedQuiz : quiz);

  useEffect(() => {
    setEditQuizVal(suggestMode ? suggestedQuiz : quiz);
  }, [quiz])

  const onNotesChange = (e: FocusEvent<HTMLDivElement>) => {
    setEditQuizVal(e.target.innerText);
  }

  const onToggleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditMode(!isEditMode);

    if(isEditMode && quiz !== editQuizVal && !suggestMode){
      saveQuiz(editQuizVal.trim());
    }
  }

  const saveNewQuiz = () => {
    saveQuiz(editQuizVal);

    const now = new Date();
    now.setDate(now.getDate() + 1);
    const tomorrow = now.toLocaleDateString();
    saveNextQuizDate(tomorrow, 1);
  }

  if(suggestMode){
    return (
      <>
        <button onClick={(e) => onToggleEdit(e)}>{!isEditMode ? "Edit" : "Preview"}</button>
        <button onClick={saveNewQuiz}>Save New Quiz</button>
  
        <div className={styles.suggestedHeader}>Suggested quiz based off of notes</div>
  
        {!isEditMode && <Quiz quiz={editQuizVal} previewMode={true} saveNextQuizDate={saveNextQuizDate} />}
        {isEditMode &&<div className={styles.editCtn}>
          <div className={styles.content} suppressContentEditableWarning={true} contentEditable={true} onBlur={(e) => onNotesChange(e)}>{editQuizVal}</div>
        </div>}
      </>
    )
  }else{
    return (
      <>
        <button onClick={(e) => onToggleEdit(e)}>{!isEditMode ? "Edit" : "Done"}</button>

        {!isEditMode && <Quiz quiz={editQuizVal} previewMode={false} saveNextQuizDate={saveNextQuizDate} quiz_cooldown_time={quiz_cooldown_time} />}
        {isEditMode && <div className={styles.editCtn}>
          <div className={styles.content} suppressContentEditableWarning={true} contentEditable={true} onBlur={(e) => onNotesChange(e)}>{editQuizVal}</div>
        </div>}
      </>
    )
  }
}

export default QuizTab;