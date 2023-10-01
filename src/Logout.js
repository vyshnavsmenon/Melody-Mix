import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import './Logout.css'

function Logout() {
    const [cookie, setCookie, removeCookie] = useCookies(['user-id']);
    const navigate = useNavigate();

    function handleLogout(){        
        removeCookie('user-id', {path: '/'});
        navigate('/login');
    }

    function redirect(){
      navigate('/');
    }
  return (
    <div className='background'>
      <div className='dialogue-box'>
          Are you sure you want to Logout?
          <div className='buttons'>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={redirect}>No</button>
          </div>
      </div>        
    </div>
  )
}

export default Logout;