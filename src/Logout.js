import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';

function Logout() {
    const [cookies, , removeCookie] = useCookies(['user-id']);
    const navigate = useNavigate();

    function handleLogout(){        
        removeCookie('user-id');
        navigate('/login');
    }
  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout