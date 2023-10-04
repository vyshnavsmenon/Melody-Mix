import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useCookies } from 'react-cookie';
import { database } from './firebase.js';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';


function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cookie] = useCookies(["user-id"]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isClicked, setIsClicked] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const userid = cookie['user-id'];

    if (!userid) {
      // If user is not logged in, redirect to the login page
      navigate('/login');
      return;  // Prevent further execution of the code
    }

    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Music", "dvGhfPODSRgcOYm6tYl7"));
        if (response.exists()) {
          setData(response.data().musicLink || []);
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
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
    setIsClicked(new Array(data.length).fill(false));
  }, [data])

  useEffect(() => {
    const audioElement = audioRefArray.current[currentAudioIndex];
    console.log(audioElement);

    if (audioElement) {
      audioElement.load();
      audioElement.play();
      setCurrentAudio(audioElement);
      console.log(currentAudio);
    }
  }, [currentAudioIndex]);

  

  async function handleFavorites(music,index){
        const updatedIcons = [...isClicked];
        updatedIcons[index] = !isClicked[index];
        setIsClicked(updatedIcons);

        const userid = cookie['user-id'];
        let userData = await getDoc(doc(database, 'Users', userid));
        console.log(userData.data());
        await updateDoc(doc(database, 'Users', userid), {
        audioFiles: [...userData.data().audioFiles, {link: music.link, name: music.name}] })
        setIsClicked(!isClicked);

        updatedIcons[index] = !isClicked[index];
        setIsClicked(updatedIcons);
  }

  return (
    <div className='home'>
      <div className='inner-div'>
        {data.map((music, index) => (
          <div className='audio' key={music.link}>
            <p>{music.name}</p>
            <audio ref={(el) => (audioRefArray.current[index] = el)} controls>
              <source src={music.link} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          <FavoriteIcon onClick={() => handleFavorites(music,index)} className={`favorite ${isClicked[index] ? 'clicked' : 'notClicked'}`}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home;