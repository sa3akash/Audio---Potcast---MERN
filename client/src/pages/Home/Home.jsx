import React from 'react';
import Card from '../../components/Card/Card';
import styles from "./Home.module.css";
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

const Home = () => {
  const navigate = useNavigate()
  const startRegister = () => {
    navigate('/authenticate');
  }

  return (
    <div className='CardCenter'>
      <Card icon="logo" title="Welcome to Podcast!">
        
        <p className={styles.homePagaraph}>We’re working hard to get Codershouse ready for everyone! While we wrap up the finishing youches, we’re adding people gradually to make sure nothing breaks :)</p>

        <Button text="Start Now" icon="arrow-forward" onClick={startRegister}/>

        <div className={styles.HomeLink}>
          <span>Have an invite text?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  )
}

export default Home;