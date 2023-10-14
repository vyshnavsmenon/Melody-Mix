import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database } from './firebase.js';
import { updateDoc, doc, getDoc, addDoc, collection, } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlaylist.css'
import { useNavigate } from 'react-router-dom';
import Loader from './Loader.js';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

function CreatePlaylist() {
    
    const [cookies, setCookies] = useCookies(["user-id"]);
    const [view, setView] = useState(0); //ith entha engane kdduthe enn manasilayo..njn oru ooham pryam thazhekk vaa
    const [audioFile, setAudioFile] = useState();
    const [uploadProgress, setUploadProgress] = useState(40);
    const [isAudioUploading, setIsAudioUploading] = useState(false);
    const [imageProgress, setImageProgress] = useState(0);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [downloadURL, setDownloadURL] = useState('');
    const storage = getStorage();
    const [publicMusic, setPublicMusic] = useState(false);
    const [privateMusic, setPrivateMusic] = useState(false);
    const [musicName, setMusicName] = useState("") 
    const [singerName, setSingerName] = useState();
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState();
    const [imageUrl, setImageUrl] = useState('https://cdn1.iconfinder.com/data/icons/metro-ui-dock-icon-set--icons-by-dakirby/128/Music.png')
    const docRef = '';

    
    useEffect(() => {
      const userid = cookies['user-id'];
      
      if (!userid) {
        // If user is not logged in, redirect to the login page
        navigate('/login');
        return;  // Prevent further execution of the code
      }      

    }, [cookies, navigate]);
    

    function handleRead(e){
        setAudioFile(e.target.files[0]) // file aayond enage veenam kodukkan... ok       
    }
    async function handleSubmit()
    {
        // setIsLoading(!isLoading);
        const storageRef = ref(storage, `/files/${file}`);
      setIsImageUploading(prev => !prev);
    // Upload the image
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log("Upload is " + percentage + "% done");
        setImageProgress(percentage);
      },
      (error) => {
        console.error("Error uploading image: ", error);
      },
      () => {
        setIsImageUploading(prev => !prev);
        // Upload completed successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("File available at", url);
          // setImageUrl(prev => url);
          if(!privateMusic)
          {
            // aah nammal else kodutha almost ellam ividem veename except user ntel aa link attach cheyyanath ozhich.eda ...njn ee else il oru grp of codes select cheyyam ath alle ivde aadhyam kodkkande enn nokkko?? hello r u there?
            if (!audioFile) {
              toast.error("Select an audio file");
              return;
            };
  
           
          setIsAudioUploading(prev => !prev);
          const storageRef = ref(storage, 'audio/' + audioFile.name);
          const uploadTask = uploadBytesResumable(storageRef, audioFile);
      
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Track upload progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress); 
            },
            (error) => {              
              //  setIsLoading(!isLoading);
              toast.error(error.message); 
            },
            () => {
              // Upload complete, get the download URL
              setIsAudioUploading(prev => !prev);
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                  // setIsLoading(!isLoading);
                  //toast.success("Music uploaded successfully")                
                  setDownloadURL(downloadURL); 
                  navigate('/');
                  let musicData = await getDoc(doc(database, 'Music', "dvGhfPODSRgcOYm6tYl7")); 
                  console.log(musicData.data());
                  console.log("music image link : ", imageUrl);
                  await updateDoc(doc(database, 'Music', "dvGhfPODSRgcOYm6tYl7"), { 
                    musicLink: [...musicData.data().musicLink, {link: downloadURL , name: musicName, imageUrl: url, SingerName: singerName, views: 0}]
                  });    
                  }); 
                });
                // setIsLoading(!isLoading);
                
            }      
          
  
          else{
            console.log(cookies['user-id']);
          if (!audioFile) {
            toast.error("Select an audio file");
            return;
          };        
          setIsAudioUploading(prev => !prev);
          // setIsLoading(!isLoading);
          const storageRef = ref(storage, 'audio/' + audioFile.name);
          const uploadTask = uploadBytesResumable(storageRef, audioFile);
      
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Track upload progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress); 
            },
            (error) => {  
              // setIsLoading(!isLoading);
              toast.error(error.message);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                  // setIsLoading(!isLoading);
                  setIsAudioUploading(prev => !prev);
                  // toast.success("Music uploaded successfully");                
                  setDownloadURL(downloadURL); 
                  navigate('/');
                  const userid = cookies['user-id'];
                  let userData = await getDoc(doc(database, 'Users', userid));
                  console.log(userData.data());
                  const docRef = await updateDoc(doc(database, 'Users', userid), {
                    audioFiles: [...userData.data().audioFiles, {link: downloadURL, name: musicName, imageUrl: url, SingerName: singerName}] 
                  });
                });
            }
          );
          // setIsLoading(!isLoading);               
          }
          // Now you can proceed to handleSignup() with the image URL
        }).catch((error) => {
          console.error("Error getting download URL: ", error);
        });
      }
    );  
       
        
    
    }
    function handlePublic(){
      setPublicMusic(!publicMusic); 
    }
    function handlePrivate()
    {
      setPrivateMusic(!privateMusic);
    }
    function handlemusicName(e)
    {
      setMusicName(e.target.value);
    }
    function handleImage(e)
    {
      setFile(e.target.files[0]);
    }
    function handlesingerName(e){
      setSingerName(e.target.value);
    }    

  if(isImageUploading){
    return(
      <div className='loader-container'>
        <h4>Image is uploading...</h4>
        <CircularProgress variant="determinate" value={imageProgress} size={120} style={{ color: '#EE3240' }}/>
      </div>
    );
  }

  if(isAudioUploading){
    return(
      <div className='loader-container'>
        <h4>Audio is uploading...</h4>
        <CircularProgress variant="determinate" value={uploadProgress} size={120} style={{ color: '#EE3240' }}/>
      </div>
    );
  }

  else {
    return (    
      <div className='mainBody'>
      {
        (isLoading) ? <div className='Loader1'><Loader/></div> : 
        
        <div className="small-Body">
          <div className='audioFile'><p className='choose'>Choose a Song</p><input className='file' type="file" accept="audio/*" onChange={handleRead}/></div>
          <div className='audioFile'><p className='choose'>Choose an Image</p><input className='file' type="file" accept="image/*" onChange={handleImage}/></div>
            <div><input className='nameOfMusic' type="text" placeholder='Name of Music' onChange={handlemusicName}/></div>
            <div><input className='nameOfMusic' type="text" placeholder='Name of the Singer' onChange={handlesingerName}/></div>
            <div className='checkBox'>Private<input  type="checkbox" onChange={handlePrivate}/></div>  
            <div className='checkBox'>Public<input type="checkbox" onChange={handlePublic}/></div>
            <div><button className='normal-btn' onClick={handleSubmit}>Upload Music</button></div>            
        </div>
      }
      <ToastContainer />
      </div>    
    );
  }
  
}

export default CreatePlaylist;