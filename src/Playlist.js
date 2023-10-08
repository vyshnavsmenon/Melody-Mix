import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { database } from './firebase';
import './Playlist.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';

function Playlist() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cookie] = useCookies(["user-id"]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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
          setIsLoading(false);
        } else {
          console.log("User document does not exist");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
        setIsLoading(false);
      }
    }

    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Users", userid));
        if (response.exists()) {
          setData(response.data().audioFiles || []);
        } else {
          console.log("Document not found");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    fetchDataOfUsers();
  }, [cookie, navigate]);

  const audioRefArray = useRef([]);

  useEffect(() => {
    data.forEach((music, index) => {
      const audioElement = audioRefArray.current[index];

      if (audioElement) {
        audioElement.addEventListener('ended', () => {
          // Play the next audio when the current one ends
          setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % data.length);
        });
      }
    });
  }, [data]);

  useEffect(() => {
    const audioElement = audioRefArray.current[currentAudioIndex];

    if (audioElement) {
      audioElement.load();
      audioElement.play();
    }
  }, [currentAudioIndex]);

  async function handleDelete(music,index){
    setIsClicked(!isClicked);
    try{
      const userid = cookie['user-id'];

    const userDocRef = doc(database, "Users", userid);
    await updateDoc(userDocRef, {
      audioFiles : arrayRemove(music)
    });

    setData((prev) => prev.filter((_,i) => i != index));    
    }
    catch(error) {
      console.error("Error : ", error)
    }
    setIsClicked(!isClicked);
  }

  return (
    <div className='playlist'>
      <div className='inner-div'>
      {isLoading && <>
          <Skeleton
          sx={{ bgcolor: 'grey.900', margin: '1rem',}}
          variant="rectangular"
          width={810}
          height={55}
        />
          <Skeleton
          sx={{ bgcolor: 'grey.900', margin: '1rem' }}
          variant="rectangular"
          width={810}
          height={55}
        />
        <Skeleton
          sx={{ bgcolor: 'grey.900',margin: '1rem' }}
          variant="rectangular"
          width={810}
          height={55}
        />
        <Skeleton
          sx={{ bgcolor: 'grey.900', margin: '1rem' }}
          variant="rectangular"
          width={810}
          height={55}
        />
        <Skeleton
          sx={{ bgcolor: 'grey.900', margin: '1rem' }}
          variant="rectangular"
          width={810}
          height={55}
        />
        <Skeleton
          sx={{ bgcolor: 'grey.900', margin: '1rem'}}
          variant="rectangular"
          width={810}
          height={55}
        />
        <Skeleton
          sx={{ bgcolor: 'grey.900', margin: '1rem' }}
          variant="rectangular"
          width={810}
          height={55}
        />
        </>}
        {data.map((music, index) => (
          <div className='audio' key={music.name}>
            <p>{music.name}</p>
            <audio ref={(el) => (audioRefArray.current[index] = el)} controls>
              <source src={music.link} type="audio/mpeg" />
              {/* Your browser does not support the audio element. */}
            </audio>
            <DeleteIcon onClick={() => handleDelete(music,index)} className={`delete ${isClicked[index] ? 'clicked' : 'notClicked'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
