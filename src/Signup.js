// Signup.jsx
import React, { useState } from 'react';
import './Login.css';
import { auth } from './firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { database } from './firebase';
import { useCookies } from "react-cookie";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import Loader from './Loader';
import { ref,  uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

function Signup() {
  const [fullname, setFullName] = useState();
  const [username, setUsername] = useState();
  const [emailid, setEmailid] = useState();
  const [password, setPassword] = useState();
  const [Phone, setPhone] = useState();
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState('https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [cookies, setCookie] = useCookies([]);
  const [isLoading, setIsLoading] = useState(false);

  // ...

  function uploadingProfilePhoto(){
    setIsLoading(!isLoading);
        const storageRef = ref(storage, `/files/${file}`);

    // Upload the image
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log("Upload is " + percentage + "% done");
      },
      (error) => {
        console.error("Error uploading image: ", error);
      },
      () => {
        // Upload completed successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("File available at", url);
          setImageUrl(url);
          // Now you can proceed to handleSignup() with the image URL
        }).catch((error) => {
          console.error("Error getting download URL: ", error);
        });
      }
    );
    setIsLoading(!isLoading);

  }
       


  function readuserName(e)
  {
    setUsername(e.target.value);
  }
  function readEmailid(e)
  {
    setEmailid(e.target.value);
  }
  function readPassword(e)
  {
    setPassword(e.target.value);
  }
  function readFullName(e){
    setFullName(e.target.value);
  }
  function readNumber(e){
    setPhone(e.target.value);
  }
  function handleProfilePhoto(e){
    setFile(e.target.files[0]);
  }
  async function handleSignup()
  {
    setIsLoading(!isLoading);
    createUserWithEmailAndPassword(auth,emailid,password)
      .then(async (response) => {
        //sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        
        console.log(response)    
        const docRef = await addDoc(collection(database, 'Users'),{
          fullname : fullname,
          username : username,
          emailid : emailid,
          password : password,
          phone : Phone,
          audioFiles: [],
          imageUrl : imageUrl          
        }); 
        const userid = docRef.id;
        await updateDoc(doc(database, 'Users', userid), {id: userid}); 
        setCookie("user-id", userid, {
          path: "/" });  
        navigate('/');
      })      
      .catch((error)=>{
        setIsLoading((prev) => {return !prev});
        console.log(error)
      })
      setIsLoading(!isLoading);
  }
  

  return (
    <div className='mainBody'>
      {(isLoading) ? <Loader/> : <div className='smallBody'>    
          <div className='heading'>Sign in</div>
          <div><input className='bar1' type="text" placeholder='Full Name' onChange={readFullName}/></div>    
          <div><input className='bar1' type="text" placeholder='Username' onChange={readuserName}/></div>
          <div><input className='bar1' type="text" placeholder='Email id' onChange={readEmailid}/></div>
          <div><input className='bar1' type="password" placeholder='Password' onChange={readPassword}/></div>
          <div><input className='bar1' type="number" placeholder='Phone Number(optional)' onChange={readNumber}/></div>
          <div><input type='file'placeholder='Upload your profile picture'  onChange={handleProfilePhoto}/></div>
          <div><button className='normal-btn' onClick={uploadingProfilePhoto}>Click here to Upload profile photo</button></div>
          <div><button className='normal-btn' onClick={handleSignup}>Sign up</button></div>          
      </div>}
    </div>
  )
}

export default Signup