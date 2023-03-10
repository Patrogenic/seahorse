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

      <img className={styles.logo} src="/SeaHorseNavBar.svg" />

      <div>
        {currView === "BookDetails" && <button onClick={backToBookList}>Back</button>}
        <button onClick={() => setCurrView("Schedule")}>Schedule</button>
        <button onClick={() => setCurrView("BookList")}>Book List</button>
      </div>
    </div>
  )
}

export default NavBar;