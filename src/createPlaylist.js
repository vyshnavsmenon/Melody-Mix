import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database } from './firebase.js';
import { updateDoc, doc, getDoc, addDoc, collection, } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlaylist.css'
import { useNavigate } from 'react-router-dom';
import Loader from './Loader.js'

function CreatePlaylist() {
    
    const [cookies, setCookies] = useCookies(["user-id"]);  //ith entha engane kdduthe enn manasilayo..njn oru ooham pryam thazhekk vaa
    const [audioFile, setAudioFile] = useState();
    const [uploadProgress, setUploadProgress] = useState(0);
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
        if(!privateMusic)
        {
          // aah nammal else kodutha almost ellam ividem veename except user ntel aa link attach cheyyanath ozhich.eda ...njn ee else il oru grp of codes select cheyyam ath alle ivde aadhyam kodkkande enn nokkko?? hello r u there?
          if (!audioFile) {
            toast.error("Select an audio file");
            return;
          };

         

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
             setIsLoading(!isLoading);
            toast.error(error.message); 
          },
          () => {
            // Upload complete, get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                setIsLoading(!isLoading);
                //toast.success("Music uploaded successfully")                
                setDownloadURL(downloadURL); 
                navigate('/');
                let musicData = await getDoc(doc(database, 'Music', "dvGhfPODSRgcOYm6tYl7")); 
                console.log(musicData.data());
                await updateDoc(doc(database, 'Music', "dvGhfPODSRgcOYm6tYl7"), { 
                  musicLink: [...musicData.data().musicLink, {link: downloadURL , name: musicName, imageUrl: imageUrl, SingerName: singerName}]
                });
                  // await addDoc(collection(database, "Music"), {
                  //   musicLink : downloadURL,
                  // });
                }); //set lle aah ene ith nee onn run chyth nokkiye.. ee .public click chythittu..ha ok.....
                // njn oru krym choikkan vittupoi...aa if inte akath kidakkanath correct alle condition...r u there?? yes...ok
              });
              setIsLoading(!isLoading);
              
          }      
        

        else{
          console.log(cookies['user-id']);
        if (!audioFile) {
          toast.error("Select an audio file");
          return;
        };        

        setIsLoading(!isLoading);
        const storageRef = ref(storage, 'audio/' + audioFile.name);
        const uploadTask = uploadBytesResumable(storageRef, audioFile);
    
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress); 
          },
          (error) => {  //eda ivde catch kodkkande? veenda ith catch pole aan work cheyyane...ook
            setIsLoading(!isLoading);
            toast.error(error.message);
          },
          () => {
            // Upload complete, get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                //console.log('File available at', downloadURL);
                setIsLoading(!isLoading);
                // toast.success("Music uploaded successfully");                
                setDownloadURL(downloadURL); 
                navigate('/');
                const userid = cookies['user-id'];
                let userData = await getDoc(doc(database, 'Users', userid));
                console.log(userData.data());
                await updateDoc(doc(database, 'Users', userid), {
                  audioFiles: [...userData.data().audioFiles, {link: downloadURL, name: musicName, imageUrl: imageUrl, SingerName: singerName}] 
                }); 
              });
          }
        );
        setIsLoading(!isLoading);               
        }
        
    
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
  )
}

export default CreatePlaylist;
