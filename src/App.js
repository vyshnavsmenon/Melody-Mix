import Navbar from './Navbar';
import Login from './Login.js';
import Signup from './Signup';
import About from './About';
import Home from './Home';
import Playlist from './Playlist';
import CreatePlaylist from './createPlaylist';
import Logout from './Logout';
import SearchResult from './SearchResult';
import VideoStreaming from './VideoStreaming';
import VideoReceiving from './VideoReceiving';
import {  Routes, Route } from 'react-router-dom';
import Profile from './Profile';


function App() { 
  return (
    <>
      <Navbar/> 
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/about' element={<About/>}></Route>                
            <Route path='/playlist' element={<Playlist/>}></Route>
            <Route path='/createplaylist' element={<CreatePlaylist/>}></Route>
            <Route path='/logout' element={<Logout/>}></Route>
            <Route path='/searchResult' element={<SearchResult  />}></Route>
            <Route path='/Melody-Mix' element={<Home />} />
            <Route path='/videoStreaming' element={<VideoStreaming />} />
<<<<<<< HEAD
            <Route path='/videoReceiving/:id' element={<VideoReceiving/>} />
=======
            <Route path='/profile' element={<Profile/>} />
>>>>>>> 84c3a0c63af0d7a506b66e1f72df2f5415b9292b
          </Routes>                   
    </>
  )
}

export default App;

