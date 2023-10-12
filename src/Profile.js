import React, {useEffect, useState} from 'react';
import './Profile.css';
import Loader from './Loader.js';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { database } from './firebase';
import { useCookies } from 'react-cookie';
import EditIcon from '@mui/icons-material/Edit';
import './Signup.css';

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState();
    const [username, setUserName] = useState();
    const [emailid, setEmailId] = useState();
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState()
    const [file, setFile] = useState();
    const [number, setNumber] = useState()
    const [imageUrl, setImageUrl] = useState()
    const [cookie] = useCookies(["user-id"]);
    const navigate = useNavigate();
    const [isDisplayed, setIsDisplayed] = useState(false);

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

    function handleEdit(){
        setIsDisplayed(!isDisplayed);
    }
    function readuserName(e)
    {
        setUserName(e.target.value);
    }
    function readEmailid(e)
    {
        setEmailId(e.target.value);
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
  return (
    <div className='profile'>
        { isLoading ? <Loader/> : 
            <div className='details'>
                <div className='heading'>
                    <h2>USER DETAILS</h2>   
                    <EditIcon onClick={handleEdit} />  
                </div>           
                <div className='deatail-item'><img className='profilePicture' src={imageUrl}/></div>
                <div className='deatail-item'><label>Full Name : {fullName}</label><br></br></div>
                <div className='deatail-item'><label>User Name : {username}</label><br></br></div>
                <div className='deatail-item'><label>Email Id  : {emailid}</label><br></br></div>
                <div className='deatail-item'><label>Phone No  : {number}</label><br></br></div>                
            </div>
        }
        <div className={`edit ${ isDisplayed ? 'displaying' : 'notDisplaying'}`}>
        <div className='heading1'>Edit</div>
          <div><input className='bar1' type="text" placeholder='Full Name' onChange={readFullName}/></div>    
          <div><input className='bar1' type="text" placeholder='Username' onChange={readuserName}/></div>
          <div><input className='bar1' type="text" placeholder='Email id' onChange={readEmailid}/></div>
          <div><input className='bar1' type="password" placeholder='Password' onChange={readPassword}/></div>
          <div><input className='bar1' type="number" placeholder='Phone Number(optional)' onChange={readNumber}/></div>
          <div><input type='file'placeholder='Upload your profile picture'  onChange={handleProfilePhoto}/></div>
          {/* <div><button className='normal-btn' onClick={uploadingProfilePhoto}>Click here to Upload profile photo</button></div>
          <div><button className='normal-btn' onClick={handleSignup}>Sign up</button></div> */}
        </div>
    </div>
  )
}

export default Profile