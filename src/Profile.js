import React, {useEffect, useState} from 'react';
import './Profile.css';
import Loader from './Loader.js';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import { database } from './firebase';
import { useCookies } from 'react-cookie';
import EditIcon from '@mui/icons-material/Edit';
import './Signup.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CircularProgress, {
    CircularProgressProps,
  } from '@mui/material/CircularProgress';

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [username, setUserName] = useState("");
    const [emailid, setEmailId] = useState("");  
    const [number, setNumber] = useState(0)
    const [imageUrl, setImageUrl] = useState('https://i.pinimg.com/474x/81/8a/1b/818a1b89a57c2ee0fb7619b95e11aebd.jpg')
    const [cookie] = useCookies(["user-id"]);
    const navigate = useNavigate();
    const storage = getStorage();
    const [imageFile, setImageFile] = useState(null);
    const [isDisplayed, setIsDisplayed] = useState(false);
    const [isDisplayed1, setIsDisplayed1] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);

    useEffect(() => {
        const userid = cookie['user-id'];

        if(!userid){
            navigate('/Melody-Mix')
        }

        async function fetchData(){
            try{
                const response = await getDoc(doc(database, "Users", userid));
                if(response.exists()){
                    setFullName(response.data().fullname);
                    setUserName(response.data().username);
                    setEmailId(response.data().emailid);
                    setNumber(response.data().phone);            
                    setImageUrl(response.data().imageUrl);
                }
                else{
                    console.log("Document not found");
                }
            }
            catch(error) {
                console.error("Errooooorr : ", error);
            }
        }

        fetchData();
    }, [cookie, navigate])
  
    function readFullName(e){
        setFullName(e.target.value);
    }
    function readUsername(e){
        setUserName(e.target.value);
    }
    function readEmailid(e){
        setEmailId(e.target.value);
    }
    function readPhoneNo(e){
        setNumber(e.target.value);
    }
    function handleEdit(){        
        setIsDisplayed(!isDisplayed);                    
    }  
    function handleEditProfilePicture(){
        setIsDisplayed1(!isDisplayed1);
    }
    async function handleSubmit(){
        if(!(fullName && username && emailid && number)){
            toast.error("All fields are mandatory");
            console.log(fullName, username, emailid, number);
            return;
        }
        const userid = cookie['user-id'];               
        await updateDoc(doc(database, 'Users', userid),{
           emailid:emailid,
           fullname:fullName,
           phone:number,
           username:username
        }).then(() => {
            console.log("user updated..");
            setIsDisplayed(!isDisplayed);
        }).catch((err) => {console.error(err)});
    }
    function handleProfilePicture(e){
        setImageFile(e.target.files[0]);
    }
    async function UpdateProfilePicture(){
        const userid = cookie['user-id'];
        const storageRef = ref(storage, 'image/' + imageFile.name);
          const uploadTask = uploadBytesResumable(storageRef, imageFile);
            setIsImageUploading(prev => !prev);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress); 
            },
            (error) => {  
              toast.error(error.message);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                  setImageUrl(downloadURL);
                  await updateDoc(doc(database, 'Users', userid),{
                    imageUrl : downloadURL
                }).then(() => {
                    setIsImageUploading(prev => !prev);
                    setIsDisplayed1(prev => !prev);
                }).catch((err) => {console.log(err)});
                });
            }
          );
        
    }

    if(isImageUploading){
        return(
          <div className='loader-container'>
            <h4>Image is uploading...</h4>
            <CircularProgress variant="determinate" value={uploadProgress} size={120} style={{ color: '#EE3240' }}/>
          </div>
        );
      }

  return (
    <div className='profile'>
        { isLoading ? <Loader/> : 
            <div className={`details ${ isDisplayed ? 'notDisplaying' : 'displaying'}`}>
                <div className='heading'>
                    <h2>USER DETAILS</h2>   
                    <EditIcon onClick={handleEdit} />  
                </div>           
                <div className='profilePhoto'><img className='profilePicture' src={imageUrl}/></div>
                <div className='addPhoto'><AddAPhotoIcon onClick={handleEditProfilePicture}/></div>
                <div className='deatail-item'><label>Full Name : {fullName}</label><br></br></div>
                <div className='deatail-item'><label>User Name : {username}</label><br></br></div>
                <div className='deatail-item'><label>Email Id  : {emailid}</label><br></br></div>
                <div className='deatail-item'><label>Phone No  : {number}</label><br></br></div>                
            </div>
        }
        <div className={`edit ${ isDisplayed ? 'displaying' : 'notDisplaying'}`}>
            <div><h2>Edit Profile</h2></div>
            <div><input value={fullName} type='text' placeholder='Full Name' onChange={readFullName}/></div>
            <div><input value={username} type='text' placeholder='Username' onChange={readUsername}/></div>
            <div><input value={emailid}  type='text' placeholder='Email id' onChange={readEmailid}/></div>
            <div><input value={number} type='text' placeholder='Phone Number' onChange={readPhoneNo}/></div>
            <div><button onClick={handleSubmit}>Submit</button></div>
        </div> 
        <div className={`editProfilePicture ${ isDisplayed1 ? 'displaying' : 'notDisplaying'}`}>
            <div><input className='profile1' type='file' onChange={handleProfilePicture}/></div>
            <div><button onClick={UpdateProfilePicture}>Submit</button></div>
        </div>  
        <ToastContainer/>       
    </div>
  )
}

export default Profile