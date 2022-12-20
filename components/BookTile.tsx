import styles from '../styles/BookTile.module.css'


type BookTileProps = {
  setCurrBookIndex: (index: number) => void;
  title: string,
  bookIndex: number,
}

const BookTile = ({ setCurrBookIndex, title, bookIndex }: BookTileProps) => {


  

  return(
    <div className={styles.ctn} onClick={() => setCurrBookIndex(bookIndex)}>
      {title}
    </div>
  )
}

export default BookTile;