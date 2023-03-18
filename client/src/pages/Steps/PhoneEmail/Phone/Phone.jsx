import React, { useState } from 'react';
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import styles from "../PhoneEmail.module.css";
import {sendOtp} from "../../../../http/index";
import { useDispatch } from "react-redux";
import { setOtp } from '../../../../store/userSlice';
import Loader from "../../../../components/Loader/Loader"

const Phone = ({onNext}) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const submit = async () => {
    if(!phone) return;
    // server request
   try{
    setLoading(true);
    const {data} = await sendOtp({phone: phone});
    dispatch(setOtp({phone: data.phone, hash: data.hash}));

    setLoading(false);
    console.log({otp: data.otp});
    onNext();
   }catch(err){
    console.log(err.message);
    setLoading(false);
   }

  }
  return (
    loading ? (<Loader message='Loading, please wait...' />) : (
     <Card title="Enter phone number" icon="phone">

          <input type="text"
          placeholder='+880 18120 68629'
          className={styles.input}
          value={phone}
          onChange={(e)=> setPhone(e.target.value)}
          />
          <Button text="Next" icon="arrow-forward" disabled={loading} onClick={submit}/>
          <p className={styles.paragraph}>By entering your number, you’re agreeing to our <br/>Terms of Service and Privacy Policy. Thanks!</p>
   </Card>
    
    )
  )
}

export default Phone;