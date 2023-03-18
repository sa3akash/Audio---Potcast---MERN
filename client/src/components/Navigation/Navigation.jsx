import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./Navigation.module.css";
import { logout } from '../../http';
import {useDispatch, useSelector} from "react-redux";
import {setAuth} from "../../store/userSlice";

const Navigation = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)

  const logoutUser = async () => {
    try{
      const {data} = await logout()
      dispatch(setAuth(data));

    }catch(err){
      console.log(err.message);
    }
  }
  return (
    <nav className={`${styles.navbar} container`}>
      <Link to='/' className={styles.logo}>
        <img src="/images/logo.png" alt="logo" />
        <span>Podcast</span>
      </Link>
      
     {user && (
       <div className={styles.profileContainer}>
        <span>{user?.name}</span>
        {user?.avater && 
            <div className={styles.profilePhotoContainer}>
              <img src={user?.avater} alt="avater" />
            </div>
          }
        <button onClick={logoutUser}>
          <img src="/images/logout.png" alt="logout" />
        </button>
     </div>
     )}
    </nav>
  )
}

export default Navigation;