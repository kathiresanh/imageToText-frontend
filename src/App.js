
import Image from './image';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState } from 'react';
import FormData from 'form-data';
import { useEffect } from 'react';
import { createWorker } from "tesseract.js";


function App() {

  const [ocr, setOcr] = useState("");
  const [count,setcount] = useState(0)
  const [file,setfile] = useState(null)
  const [image,setimage] = useState(null)
  const onFormSubmit =async (e)=>{
    e.preventDefault()

    const formdata = new  FormData();
    formdata.append("photo",file)
    const config = {
      headers :{
        'content-type' :'multipary/form-data'
      }
    }
 
   await axios.post("https://imagetotextend.herokuapp.com/user/upload",formdata,config).then(function(response){
      alert("sucessfully")
    }).catch((error)=>{
      alert("error")
    })

  }
  

  const worker = createWorker({
    logger: (m) => {
      
      setcount(m.progress)
    },
  });
  const convertImageToText = async () => {
    if (!image) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(image);
    setOcr(text);
  };

  let oninputchange = event =>{
    const images = event.target.files[0];
    setfile(event.target.files[0])
       if(!file)return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setimage(imageDataUri);
    };
    reader.readAsDataURL(images);
  } 

  
  useEffect(() => {
    convertImageToText();
  }, [image]);



  return (
    <div className="container-fluid">
      <div className='row'>
        <div className='col-sm-12' id='card1'>
       <div className='card' >
         <div className='card-body'>
         <form onSubmit={onFormSubmit}>
           <h1>Upload the image and convert it into text</h1>
           <input type="file" name='photo' onChange={oninputchange}/>
           <button type='submit'>upload</button>
         </form>
         </div>
       </div>
        </div>
        <div className='col-sm-12'>
          <div className='row'>
            <div className='col-sm-6' id='imagetab'>
            <img src={image} id="photos"></img>
            </div>
            <div className='col-sm-6' id='resulttab'>
              <h1>Progress : {count*100}</h1>
            <textarea rows="15"  cols="100" style={{color:"yellow",backgroundColor:"black"}} className='form-control' value={ocr}></textarea>
            </div>
          </div>
      
      
          </div>
      </div>
    </div>
  );
}

export default App;
