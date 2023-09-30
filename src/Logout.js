import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import './Logout.css'

function Logout() {
    const [, , removeCookie] = useCookies(['user-id']);
    const navigate = useNavigate();

    function handleLogout(){        
        removeCookie('user-id');
        navigate('/login');
    }

    function redirect(){
      navigate('/');
    }
  return (
    <div className='background'>
      <div className='dialogue-box'>
          <p>Are you sure you want to Logout?</p>
          <div className='buttons'>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={redirect}>No</button>
          </div>
      </div>        
    </div>
  )
}

export default Logout