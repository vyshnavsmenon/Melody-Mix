import { Link, useNavigate, useLocation  } from "react-router-dom";
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
import { doc, getDoc } from "firebase/firestore";
import { useCookies } from "react-cookie";
import { database } from "./firebase";
import AudioPlayer from './AudioPlayer';

function Navbar() {    
    const location = useLocation();
    const inputRef = useRef();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); 
    const [isClicked, setIsClicked] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [cookie, setCookie] = useCookies(["user-id"]);
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

    return () => {
        // Cleanup the event listener when component is unmounted
        document.removeEventListener("mousedown", handler);
    };
}, [isOpen]);
    

    useEffect(() => {
        async function fetchData(){
            try{
                const userid = cookie['user-id'];
                const response = await getDoc(doc(database, "Users", userid))
                if(response.exists()){
                    setImageUrl(response.data().imageUrl);
                }    
            }  
            catch(error){                
                console.log("Error fetching data: ", error);
            }
        }
    })

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
                        <li>
                            <Link className="list" to="/login">Log In</Link>
                        </li>
                        <li >
                            <Link className="list" to="/signup">Sign Up</Link>
                        </li>                      
                        <li >
                            <Link className="list" to="/about">About</Link>
                        </li>
                        <li >
                            <Link className="list" to="/profile"><img className="profile-picture" src={imageUrl}/></Link>
                        </li>  
                    </ul>    
            </div>               
        </nav>
         {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <div className="bottomMusic-container">
          <AudioPlayer />
        </div>
      )}
        <div className={`bottomNav-container ${location.pathname === '/login' || location.pathname === '/signup' ? 'custom-css-class' : ''}`}>
        {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <AudioPlayer/> )};
       <div className={`bottomNav`}>
        <span><Link className="list" to="/"><HomeIcon className="bottom-icon" /></Link></span>
        <span><Link className="list" to="/playlist"><QueueMusicIcon className="bottom-icon" /></Link></span>
        <span><Link className="list" to="/createPlaylist"><UploadIcon className="bottom-icon" /></Link></span>
        <span><Link className="list" to="/logout"><LogoutIcon className="bottom-icon" /></Link></span>
       </div>
        </div>
          
            
        <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
        <ul className="unordered" >
            <div className="content">            
                
                <li>
                    <Link className="link" to="/">
                    <HomeIcon className="icon"/>
                    <p>Home</p></Link>
                </li>
            </div>            
            <div className="content">                
                <li>
                    <Link className="link" to="/playlist">                    
                    <QueueMusicIcon className="icon"/>                
                        <p>Playlist</p></Link>

                </li> 
            </div>   
            <div className="content">                
                <li>
                    <Link className="link" to="/createPlaylist">
                    <PlaylistAddIcon className="icon"/>
                        <p>Create Playlist</p></Link>

                </li> 
            </div>    
            <div className="content">                
                <li>
                    <Link className="link" to="/createPlaylist">
                    <UploadIcon className="icon"/>
                        <p>Upload Music</p></Link>

                </li> 
            </div>    
            <div className="content">                
                <li>
                    <Link className="link" to="/logout">
                    <LogoutIcon className="icon"/>
                        <p>Logout</p></Link>

                </li> 
            </div>    
        </ul>                           
        </div>
    </>
  )
}
 
export default Navbar;

