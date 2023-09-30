// Signup.jsx
import React, { useState } from 'react';
import './Signup.css';
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
  deleteDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import Loader from './Loader';

function Signup() {
  const [username, setUsername] = useState();
  const [emailid, setEmailid] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [cookies, setCookie] = useCookies([]);
  const [isLoading, setIsLoading] = useState(false);

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
  async function handleSignup()
  {
    setIsLoading(!isLoading);
    createUserWithEmailAndPassword(auth,emailid,password)
      .then(async (response) => {
        //sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        
        console.log(response)    
        const docRef = await addDoc(collection(database, 'Users'),{
          username : username,
          emailid : emailid,
          password : password,
          audioFiles: [],
        }); 
        const userid = docRef.id;
        await updateDoc(doc(database, 'Users', userid), {id: userid}); 
        setCookie("user-id", userid, {
          path: "/" });  
        navigate('/Melody-Mix/');
      })      
      .catch((error)=>{
        console.log(error)
      })
      setIsLoading(!isLoading);
  }
  
  return (
    <div className='body'>
      {(isLoading) ? <Loader/> : <div className='body1'>    
          <div className='heading1'>Sign in</div>    
          <div><input className='bar1' type="text" placeholder='Username' onChange={readuserName}/></div>
          <div><input className='bar1' type="text" placeholder='Email id' onChange={readEmailid}/></div>
          <div><input className='bar1' type="password" placeholder='Password' onChange={readPassword}/></div>
          <div><button className='button1' onClick={handleSignup}>Sign up</button></div>          
      </div>}
    </div>
  )
}

export default Signup