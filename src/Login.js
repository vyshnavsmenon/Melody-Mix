import { useState } from 'react'
import { auth } from './firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup,sendPasswordResetEmail, } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { database } from './firebase';
import { useCookies } from "react-cookie";
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import Loader from './Loader.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from './google_prev_ui.png';


function Login() {
  const [emailid, setemailId]  = useState();
  const [password, setPassword] = useState();
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [isClicked4, setIsClicked4] = useState(false);
  const [cookie, setCookie] = useCookies([]);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function readEmailid(e)
  {
    setemailId(e.target.value);
  }
  function readPassword(e)
  {
    setPassword(e.target.value);
  }
  function handleSignin()
  {
    setIsClicked2(!isClicked2);
    navigate('/signup');    
  }
  function handleLogIn() {
    setIsLoading(!isLoading);
    setIsClicked1(!isClicked1);    
  
    signInWithEmailAndPassword(auth, emailid, password)
      .then((response) => {
        console.log(response);
        const collectionRef = collection(database, 'Users'); // Replace 'users' with your actual collection name
        const q = query(collectionRef, where('emailid', '==', emailid)); // Use 'userEmail' variable
  
        getDocs(q)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // Assuming there's only one matching document, so we access the first one
              const docSnapshot = querySnapshot.docs[0];
  
              // Extract the document ID
              const docId = docSnapshot.id;
  
              setCookie("user-id", docId, { path: "/" });
              navigate('/');
            } else { 
              setIsLoading(!isLoading);
              toast.error('User not found'); 
            }
          })
          .catch((error) => {
            setIsLoading(!isLoading);
            toast.error(error.message);
          });//ippo njn online il aano.. atho poyo..
      })
      .catch((error) => {
        setIsLoading(!isLoading);
        toast.error(error.message);
      });
      setIsLoading(!isLoading);
  }
  
  async function SignInWithGoogle()
  {
    try {
      setIsLoading(!isLoading);
      setIsClicked3(!isClicked3);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      const userEmail = user.email;
      const collectionRef = collection(database, 'Users'); // Replace 'users' with your actual collection name
      const q = query(collectionRef, where('emailid', '==', userEmail)); // Use 'userEmail' variable
    
        const querySnapshot = await getDocs(q);
      
        if (!querySnapshot.empty) {
          // Assuming there's only one matching document, so we access the first one
          const docSnapshot = querySnapshot.docs[0];
      
          // Extract the document ID
          const docId = docSnapshot.id;
      
          setCookie('user-id', docId, {
            path: '/'
          });
      } else {
        console.log('Document not found');
      }
    
      navigate('/');
    } catch (error) {
      console.error(error);
    }
    setIsLoading(!isLoading);
      } 
      
  function handleForgotPassword()
  {
    setIsLoading(!isLoading);
    setIsClicked4(!isClicked4);
    const auth = getAuth();
    sendPasswordResetEmail(auth, emailid)
    .then(()=>{
      console.log("email sent");
    })
    .catch((error) => {
      console.log(error.message)
  });
  setIsLoading(!isLoading);
  }
  return (
      <div className='mainBody'>
        {(isLoading)? <Loader/> : <div className='smallBody'>
          <div className='heading'>Log in</div>
          <div><input className='bar' type="text" placeholder='email' onChange={readEmailid}/></div>
          <div><input className='bar' type="password" placeholder='password' onChange={readPassword}/></div>
          <div><button className='normal-btn' onClick={handleLogIn}>log in</button></div>
          <div><button className='google-btn' onClick={SignInWithGoogle}><div className='google'><img src={image} alt="google logo"/></div><p>continue with Google</p></button></div>
         <div className='botton-grp'>
           <div>Already a user ? <a className="sign-in" onClick={handleSignin}>sign in</a></div>
          <div><a className="forgot-password" onClick={handleForgotPassword}>Forgot Password</a></div>          
         </div>
        </div>}        
        <ToastContainer/>
      </div>
  )
}

export default Login

