import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { database } from './firebase.js';
import { toast } from 'react-toastify';
import './SearchResult.css';
import { useAppStore } from './store/appStore.js';

function SearchResult() {
  const [ setAudioTracks] = useAppStore((state) => {
    return [
        state.setAudioTracks,
    ]
  });
  const [ setCurrentTrack ] = useAppStore((state) => {
    return [
      state.setCurrentTrack,
    ]
  })
  const [setCurrentTrackIndex] = useAppStore((state) => {
    return [
      state.setCurrentTrackIndex,
    ]
  })
  const currentIndex = useAppStore((state) => state.currentTrackIndex);
  const currentTrack = useAppStore((state) => state.currentTrack);
  const audioTracks = useAppStore((state) => state.audioTracks);
  const [data, setData] = useState([]);
  const search = useAppStore((state) => state.search);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Music", "dvGhfPODSRgcOYm6tYl7"));
  
        if (response.exists()) {
          const responseData = response.data();
          console.log(responseData);
          const searchLower = search.toLowerCase(); // Convert search to lowercase
  
          // Use map and toLowerCase to convert all music names to lowercase for comparison
          const filteredData = Array.isArray(responseData.musicLink)
            ? responseData.musicLink.filter(item => item.name.toLowerCase().includes(searchLower))
            : [];
  
          setData(filteredData);
        } else {
          toast.error("Document not found.");
        }
      } catch (error) {
        console.log("Error Fetching data: ", error);
      }
    }
  
    fetchData();
  }, [search]);  // Add search as a dependency to useEffect
  
  function handleChangeMusic(music, index){
    setCurrentTrack(music);
    setCurrentTrackIndex(index);
  }


  return (
    <div className='mainBody'>
      <div className='inner-div'>
      {data.map((music, index) => (
            <div className='audio' key={music.link}> 
              <div className='audio-left'>
                <div className='image'>
                <img src={music.imageUrl}/>  
                </div>
                <div className='audio-contents' onClick={() => {handleChangeMusic(music,index)}}>
                <h4>{music.name}</h4>
                <p>{music.SingerName}</p>
                </div>
              </div>
            {/* <FavoriteIcon onClick={() => handleFavorites(music,index)} className={`favorite ${isClicked[index] ? 'clicked' : 'notClicked'}`}/> */}
            </div>
          ))}
      </div>
    </div>
  )
}

export default SearchResult;