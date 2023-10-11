import React, {useEffect, useState} from 'react';
import './Profile.css';
import Loader from './Loader.js';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { database } from './firebase';
import { useCookies } from 'react-cookie';

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState();
    const [username, setUserName] = useState();
    const [emailid, setEmailId] = useState();
    const [number, setNumber] = useState()
    const [imageUrl, setImageUrl] = useState()
    const [cookie] = useCookies(["user-id"]);
    const navigate = useNavigate();

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
  return (
    <div className='profile'>
        { isLoading ? <Loader/> : 
            <div className='details'>
                <h2>USER DETAILS</h2>
                <div className='deatail-item'><img className='profilPicture' src={imageUrl}/></div>
                <div className='deatail-item'><label>Full Name : {fullName}</label><br></br></div>
                <div className='deatail-item'><label>User Name : {username}</label><br></br></div>
                <div className='deatail-item'><label>Email Id  : {emailid}</label><br></br></div>
                <div className='deatail-item'><label>Phone No  : {number}</label><br></br></div>
            </div>
        }
    </div>
  )
}

export default Profile