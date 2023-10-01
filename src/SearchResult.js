import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { database } from './firebase.js';
import { toast } from 'react-toastify';
import './SearchResult.css';
import { useAppStore } from './store/appStore.js';


function SearchResult() {
  const [data, setData] = useState([]);
  const search = useAppStore((state) => state.search);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Music", "dvGhfPODSRgcOYm6tYl7"));
        
        if (response.exists()) {
          const responseData = response.data();
          console.log(responseData); // ith ionn run chyth nokki output phtot ido..ha
          const filteredData = Array.isArray(responseData.musicLink)
            ? responseData.musicLink.filter(item => item.name === search)
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

  return (
    <div className='mainBody'>
      <div className='inner-div'>
        {data.map((music, index) => (
          <div className="audio" key={index}>
            {music.name}
            <audio controls>
              <source src={music.link} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResult;