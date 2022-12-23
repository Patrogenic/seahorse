import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../pages";
import styles from '../styles/PDFTab.module.css'
import { Book } from "../types";

type PDFTabProps = {
  savePDF: (quiz: string) => void,
  pdf_filename: string,
  PDFUrl: string,
}


//PDF Notes:
//I'll have to think of a way to not reload the PDF everytime I navigate to and away from it (if that's important)

// next steps:
// work on PDF edit screen (what should this look like?)
// currently just go forward with opening up the PDF link in a new tab



const PDFTab = ({ savePDF, pdf_filename, PDFUrl }: PDFTabProps) => {
  const supabaseClient = useSupabaseClient();
  const user = useContext<User>(UserContext);
  const [ file, setFile ] = useState<File | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfFrameRef = useRef<HTMLObjectElement>(null);
  const hasPDF = pdf_filename?.includes(".pdf");
  


  useEffect(() => {

    // const onOrientationChange = (e: Event) => {
    //   switch (screen.orientation.type) {
    //     case "landscape-primary":
    //       pdfFrameRef.current?.requestFullscreen();
    //       break;
    //     case "landscape-secondary":
    //       pdfFrameRef.current?.requestFullscreen();
    //       break;
    //     case "portrait-secondary":
    //       document.exitFullscreen();
    //       break;
    //     case "portrait-primary":
    //       document.exitFullscreen();
    //       break;
    //     default:
    //       console.log("The orientation API isn't supported in this browser :(");
    //   }
    // }

    // if(window.screen.orientation){
    //   window.screen.orientation.addEventListener("change", onOrientationChange);
    // }

    // return () => {
    //   window.screen.orientation.removeEventListener("change", onOrientationChange);
    // }
  }, [])


  const selectPDF = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files){
      setFile(e.target.files[0])
    }
  }
  
  const uploadPDF = async () => {
    if(file){
      const res = await supabaseClient.storage.from("pdfs").upload(`${user.id}/${file.name}`, file);
      savePDF(file.name);
      setFile(null);

      if(fileInputRef.current?.value){
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <button onClick={() => uploadPDF()}>Upload</button>
      {/* <button onClick={() => pdfFrameRef.current?.requestFullscreen()}>Fullscreen</button> */}
      <input ref={fileInputRef} id="upload" type="file" accept=".pdf" onChange={e => selectPDF(e)} />
      { 
        // <div style={{height: "100%"}}>
        //   <iframe width="100%" height="100%"  src={url} />
        // </div>
        hasPDF && <div><a href={PDFUrl} target="_blank" rel="noreferrer">View PDF</a></div>
      // <object ref={pdfFrameRef} data={url} type="application/pdf">
      //     <iframe height="100%" width="100%" src={`https://docs.google.com/viewer?url=${url}&embedded=true`}></iframe>
      // </object>
      }

      {!hasPDF && <div>No PDF Uploaded</div>}


    </>
  )
}

export default PDFTab;