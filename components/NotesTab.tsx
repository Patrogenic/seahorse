import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import styles from '../styles/NotesTab.module.css'


type NotesTabProps = {
  setNotes: (quiz: string) => void,
  notes: string,
  PDFUrl: string,
}

const NotesTab = ({ setNotes, notes, PDFUrl }: NotesTabProps) => {
  const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
  const [ editNotesVal, setEditNotesVal ] = useState<string>(notes);
  const viewNotesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(viewNotesRef.current){
      viewNotesRef.current.innerHTML = parseNotes(notes);
    }

  }, [viewNotesRef, notes, isEditMode])

  const onNotesChange = (e: FocusEvent<HTMLDivElement>) => {
    setEditNotesVal(e.target.innerText);
  }

  const onToggleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditMode(!isEditMode);

    // console.log(editNotesVal);
    if(isEditMode && notes !== editNotesVal){
      // setNotes(editNotesVal);
    }
  }

  //clean this up and maybe break it up more and make it more understandable
  //probably would be useful to have it multiple functions for testing and clarity purposes

  const parseNotes = (notes: string): string => {
    let parsedNotes = "";
    const lines = notes.split("\n");

    for(let line of lines){
      let lineCopy = line;

      if(lineCopy.includes("Page")){
        let pageStartIndex = lineCopy.indexOf("Page");
        
        let [ page, pageNumber ] = lineCopy.slice(pageStartIndex).split(" ");
        lineCopy = lineCopy.slice(0, pageStartIndex) + `<a href="${PDFUrl}#page=${pageNumber}" target="blank" class=${styles.pageLink}>Page ${pageNumber}</a>`
      }


      if(lineCopy.startsWith("Chapter")){
        parsedNotes += `<b>${lineCopy}</b>`
      }else if(lineCopy.startsWith("Part")){
        parsedNotes += `<b>${lineCopy}</b>`
      }else{
        parsedNotes += lineCopy;
      }
      parsedNotes += "\n";
    }

    return parsedNotes;
  }

  return (
    <>
      <button onClick={(e) => onToggleEdit(e)}>{!isEditMode ? "Edit" : "Done"}</button>

      {!isEditMode && <div ref={viewNotesRef} className={styles.viewCtn}></div>}
      {isEditMode && <div className={styles.editCtn} suppressContentEditableWarning={true} contentEditable={true} onBlur={(e) => onNotesChange(e)}>{editNotesVal}</div>}
    </>
  )
}

export default NotesTab;