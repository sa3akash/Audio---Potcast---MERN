import React, { useState } from 'react';
import {Link} from "react-router-dom";
import Card from '../../../components/Card/Card';
import styles from "./Otp.module.css";
import Button from '../../../components/Button/Button';
import { verifyOtp } from "../../../http";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/userSlice";

const Otp = () => {
  const [otp, setOtp] = useState('');
  const {phone, hash} = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();
  

  const submit = async () => {
    if(!otp) return;
    
    try{
      const {data} = await verifyOtp({otp, phone, hash});

      dispatch(setAuth(data));

    }catch(err){
      console.log(err.message);
    }

  }

  return (
    <div className='CardCenter'>
      <Card title="Enter your otp code" icon="Lock">
      <input type="text" placeholder='7777' className={styles.input} maxLength="4" onChange={(e)=> setOtp(e.target.value)}/>

        <div className={styles.spanWrapper}>
          <span>Didn’t receive?</span>
          <Link to='/'>Tap to resend</Link>
        </div>
        <Button text="Next" icon="arrow-forward" onClick={submit}/>
      </Card>
    </div>
  )
}

export default Otp;