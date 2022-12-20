import { useState } from "react";
import { Book } from "../types";
import styles from '../styles/BookDetails.module.css'

type BookDetailsProps = {
  quizTab: React.ReactNode,
  notesTab: React.ReactNode,
  pdfTab: React.ReactNode,
}

export type TabNames = "quiz" | "notes" | "pdf";

// need to handle navigating between the children
const BookDetails = ({ quizTab, notesTab, pdfTab  }: BookDetailsProps) => {
  const [ currTab, setCurrTab ] = useState<TabNames>("quiz");

  const displayTab = (tabName: TabNames) => {
    if(tabName === "quiz"){
      return quizTab;
    }else if(tabName === "notes"){
      return notesTab;
    }else if(tabName === "pdf"){
      return pdfTab;
    }
  }

  const getNavBarItemStyle = (tabName: TabNames) => {
    return currTab === tabName ? styles.navBarItemSelected : styles.navBarItem;
  }

  return(
    <>
      <div className={styles.navBar}>
        <div className={getNavBarItemStyle("quiz")} onClick={() => setCurrTab("quiz")} >Quiz</div>
        <div className={getNavBarItemStyle("notes")} onClick={() => setCurrTab("notes")} >Notes</div>
        <div className={getNavBarItemStyle("pdf")} onClick={() => setCurrTab("pdf")} >PDF</div>
      </div>


      <div className={styles.tabCtn}>
        {displayTab(currTab)}
      </div>
    </>
  )
}

export default BookDetails;