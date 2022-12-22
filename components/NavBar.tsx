import styles from '../styles/NavBar.module.css'
import { Views } from '../types';


type NavBarTypes = {
  currView: Views,
  setCurrView: (view: Views) => void
}

const NavBar = ({ currView, setCurrView }: NavBarTypes) => {

  const backToBookList = () => {
    setCurrView("BookList")
  }

  return (
    <div className={styles.ctn}>
      {currView === "BookDetails" && <button onClick={backToBookList}>Back</button>}
    </div>
  )
}

export default NavBar;