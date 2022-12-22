import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import styles from '../styles/BookTile.module.css'


type BookTileProps = {
  onBookClick: () => void;
  title: string,
  dashboardEditMode: boolean,
  setBookTitle: (book_title: string) => void,
}

const BookTile = ({ onBookClick, title, dashboardEditMode, setBookTitle }: BookTileProps) => {
  const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
  const [ editTitleVal, setEditTitleVal ] = useState<string>(title);
  const onTileClick = !dashboardEditMode ? () => onBookClick() : () => {}

  useEffect(() => {
    if(!dashboardEditMode){
      setIsEditMode(false);
    }
  }, [dashboardEditMode])


  const onToggleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditMode(!isEditMode);

    if(isEditMode && title !== editTitleVal){
      setBookTitle(editTitleVal);
    }
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditTitleVal(e.target.value);
  }

  return(
    <div className={styles.ctn} onClick={onTileClick}>
      {!isEditMode && <span>{title}</span>}
      {isEditMode && <input value={editTitleVal} onChange={(e) => onTitleChange(e)}></input>}
      
      {dashboardEditMode && <div className={styles.btnCtn}>
        <button onClick={(e) => onToggleEdit(e)}>{!isEditMode ? "Edit" : "Done"}</button>
        <button>Del</button>
      </div>}
    </div>
  )
}

export default BookTile;