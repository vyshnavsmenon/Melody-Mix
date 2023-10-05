import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import './Menubar.css';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import UploadIcon from '@mui/icons-material/Upload';
import MelodyMix from './MELODYMIX.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppStore } from "./store/appStore";
import { useRef } from 'react'

function Navbar() {    

    const inputRef = useRef();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); 
    const [isClicked, setIsClicked] = useState(false);
    const [search, changeTheValueOfSearch] = useAppStore((state) => {
        return [
            state.search,
            state.changeTheValueOfSearch
        ]
    })

    const sidebarRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if(!sidebarRef.current.contains(e.target)){
                if(isOpen){
                    setIsOpen(false);
                }
            }
        }

        document.addEventListener("mousedown", handler);

    });

    function toggleSidebar () {
        setIsOpen(!isOpen);
      };

    function handleColor() {
        setIsClicked(!isClicked);
    }

  return (
    <>
        <nav className="NavBar" >            
            <div className="first-portion">
                <div className="menu" onClick={toggleSidebar}>{isOpen ? <CloseIcon/> : <MenuIcon/> }</div> 
                <div className="logo"><img src={MelodyMix} alt="logo"/></div>
                <div className="melody-mix"><p><strong>MELODY MIX</strong></p></div>             
            </div>                                        
            <div className="searchBar">
                <input className="search-Bar" type="search" placeholder="Search" ref={inputRef}/>
                <div className="searchicon" onClick={()=> {changeTheValueOfSearch(inputRef.current.value);
                        navigate("/searchResult");
                    }} ><SearchIcon/></div>
            </div> 
                <div className="links">                    
                    <ul className="unordered-list">
                        {/* <li onClick={handleColor} className={`favorite ${isClicked ? 'clicked' : 'notClicked'}`}> 
                            <FavoriteIcon/>
                        </li> */}
                        <li>
                            <Link className="list" to="/login">Log In</Link>
                        </li>
                        <li >
                            <Link className="list" to="/signup">Sign Up</Link>
                        </li>                        
                        <li >
                            <Link className="list" to="/about">About</Link>
                        </li>
                    </ul>    
            </div>               
        </nav>
          
            
        <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
        <ul className="unordered" >
            <div className="content">            
                
                <li>
                    <Link className="link" to="/"><li className="icon">
                    <HomeIcon/>
                    </li><p>Home</p></Link>
                </li>
            </div>            
            <div className="content">                
                <li>
                    <Link className="link" to="/playlist">
                    <li className="icon">
                    <QueueMusicIcon/>
                </li>
                        <p>Playlist</p></Link>

                </li> 
            </div>   
            <div className="content">                
                <li>
                    <Link className="link" to="/createPlaylist">
                    <li className="icon">
                    <PlaylistAddIcon/>
                </li>
                        <p>Create Playlist</p></Link>

                </li> 
            </div>    
            <div className="content">                
                <li>
                    <Link className="link" to="/createPlaylist">
                    <li className="icon">
                    <UploadIcon/>
                </li>
                        <p>Upload Music</p></Link>

                </li> 
            </div>    
            <div className="content">                
                <li>
                    <Link className="link" to="/videoStreaming">
                    {/* <li className="icon">
                    <UploadIcon/>
                </li> */}
                        <p>Video</p></Link>

                </li> 
            </div>    
            <div className="content">                
                <li>
                    <Link className="link" to="/logout">
                    <li className="icon">
                    <LogoutIcon/>
                </li>
                        <p>Logout</p></Link>

                </li> 
            </div>    
        </ul>                           
        </div>
    </>
  )
}
 
export default Navbar;

