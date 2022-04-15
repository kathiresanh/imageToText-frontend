
import Image from './image';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState } from 'react';
import FormData from 'form-data';
import { useEffect } from 'react';
import { createWorker } from "tesseract.js";


function App() {

 
  var data = []
  const [ocr, setOcr] = useState("");
  const [imageData, setImageData] = useState(null);
  const [count,setcount]=useState(0)
  const worker = createWorker({
    logger: (m) => {
        setcount(m.progress)
    },
  });
  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);
    setOcr(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file)return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }
   
  let changeImage = (e)=>{
      console.log(e.target)
      setImageData(e.target)
  }
  let imagetype = typeof(imageData)
  

  return (
    <div className="container-fluid">
      <div className='row'>
        <div className='col-sm-12' id='card1'>
       <div className='card' >
         <div className='card-body'>
       
           <h2>Upload the image and convert it into text</h2>
           <input 
           type="file"
           name='photo' 
           onChange={handleImageChange}
          accept="image/*"/>
        
       
         </div>
       </div>
        </div>
        <div className='col-sm-12'>
          <div className='row'>
            <div className='col-sm-6 p-5' id='imagetab'>
     
          {typeof(imageData)== imagetype  ?   <img  src={imageData} id="photos"></img>: null  }
            
             <h4>Click on the images  convert to text </h4>
            <img  src={`./images/1.jpg`}  className="p-3" onClick={(e)=>{changeImage(e)}} id="photos"></img>
            <img  src={`./images/2.jpg`} className="p-3"  onClick={(e)=>{changeImage(e)}}  id="photos"></img>
            <img  src={`./images/3.png`}  className="p-3" onClick={(e)=>{changeImage(e)}}  id="photos"></img>
            </div>
            <div className='col-sm-6' id='resulttab'>
              <h2 style={{color:"white"}}>Progress : {count*100}</h2>
            <textarea rows="15"  cols="100" style={{color:"yellow",backgroundColor:"black"}} className='form-control' value={ocr}></textarea>
            </div>
          </div>
      
      
          </div>
      </div>
    </div>
  );
}

export default App;
