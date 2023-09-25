import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getDoc, doc } from 'firebase/firestore';
import { database } from './firebase';
import './Playlist.css'


function Playlist() {
  const [data,setData] = useState([]);
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["user-id"]);

  useEffect(() => {
    const userid = cookie['user-id'];
    
    if (!userid) {
      // If user is not logged in, redirect to the login page
      navigate('/login');
      return;  // Prevent further execution of the code
    }

    async function fetchDataOfUsers() {
      try {
        const userDocRef = doc(database, "Users", userid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    }
    
  
    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Users", userid));
        if (response.exists()) {
          setData(response.data().audioFiles || []); //are u here?
        } else {
          
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchData();
    fetchDataOfUsers();
  }, [cookie, navigate]);
  


  return (
    <div className='playlist'>
      {data.map((music) => (
        <div className='audio' key={music}>
          {music.name}
          <audio controls>
            <source src={music.link} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}         
    </div>
  )
}

export default Playlist

// error nthann kittiyo? illa nokkan.. chat il vaa....ok