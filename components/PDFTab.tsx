import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from '../styles/PDFTab.module.css'
import { Book } from "../types";


type PDFTabProps = {
  setPDF: (quiz: string) => void,
  pdf_filename: string,
}


// next steps:
// upload PDF
// update row in Books table
// update books state
// react use context for user information
// work on PDF edit screen
// get the PDF in a PDF viewer (an iFrame might work?)
// might need to use fullscreen API
// might need to publish the app to vercel so I can see it all from my phone (guess that means putting it on GitHub as well)

const PDFTab = ({ setPDF, pdf_filename }: PDFTabProps) => {
  const supabaseClient = useSupabaseClient();
  const [ file, setFile ] = useState<File | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ url, setUrl ] = useState<string>();
  const [ loading, setLoading ] = useState<boolean>(true);
  
  // need to have react use context to pass in user information
  //e28bad9e-0587-4ca5-adca-9d3229382a5f
  const editPDF = async () => {
      // const res = await supabaseClient.storage.from("pdfs").upload("");

  }

  // this might create a new url every time I navigate to and away from this tab, which would not be ideal
  useEffect(() => {
    const getPDFUrl = async () => {
      const res = await supabaseClient.storage.from("pdfs").createSignedUrl(`${"e28bad9e-0587-4ca5-adca-9d3229382a5f"}/${pdf_filename}`, 3600);
      console.log("pdfs", res)
  
      if(res?.data?.signedUrl){
        // window.open(res.data?.signedUrl + "#page=3");
        setUrl(res.data?.signedUrl);
      }
      setLoading(false);
    }

    getPDFUrl();
  }, [])


  const selectPDF = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files){
      setFile(e.target.files[0])
    }
  }
  
  const uploadPDF = async () => {
    if(file){
      const res = await supabaseClient.storage.from("pdfs").upload("e28bad9e-0587-4ca5-adca-9d3229382a5f/" + file.name, file);
      setPDF(file.name);
      setFile(null);

      if(fileInputRef.current?.value){
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <button onClick={() => uploadPDF()}>Upload</button>
      <input ref={fileInputRef} id="upload" type="file" accept=".pdf" onChange={e => selectPDF(e)} />
      {!loading && 
        <div style={{height: "100%"}}>
          <iframe width="100%" height="100%"  src={url} />
        </div>
      }
    </>
  )
}

export default PDFTab;