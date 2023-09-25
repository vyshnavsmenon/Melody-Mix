import Navbar from './Navbar';
import Login from './Login.js';
import Signup from './Signup';
import About from './About';
import Home from './Home';
import Playlist from './Playlist';
import CreatePlaylist from './createPlaylist';
import Logout from './Logout';
import SearchResult from './SearchResult';
import {  Routes, Route } from 'react-router-dom';


function App() { 
  return (
    <>
      <Navbar/> 
          <Routes>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/about' element={<About/>}></Route>                
            <Route path='/' element={<Home/>}></Route>
            <Route path='/playlist' element={<Playlist/>}></Route>
            <Route path='/createplaylist' element={<CreatePlaylist/>}></Route>
            <Route path='/logout' element={<Logout/>}></Route>
            <Route path='/searchResult' element={<SearchResult  />}></Route>
          </Routes>                   
    </>
  )
}

export default App;

// echo "# Melody-Mix" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/vyshnavsmenon/Melody-Mix.git
// git push -u origin main