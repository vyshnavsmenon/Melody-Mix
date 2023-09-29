import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useCookies } from 'react-cookie';
import { database } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cookie] = useCookies(["user-id"]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

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

  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener('ended', () => {
        // Play the next audio when the current one ends
        setCurrentAudioIndex((prevIndex=-1) => (prevIndex + 1) % data.length);
      });
    }
  }, [data]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentAudioIndex]);

  return (
    <div className='home'>
      {data.map((music, index) => (
        <div className='audio' key={music.link}>
          {music.name}
          <audio ref={index === currentAudioIndex ? audioRef : null} controls>
            <source src={music.link} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  )
}

export default Home;
