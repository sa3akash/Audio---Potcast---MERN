import React from 'react';
import { useState } from 'react';
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import styles from './Avater.module.css';
import {useSelector, useDispatch} from "react-redux";
import {setAvater} from "../../../store/activateSlice";
import {setAuth} from "../../../store/userSlice";
import {activate} from "../../../http";
import Loader from "../../../components/Loader/Loader";

const Avater = () => {
  const {name, avater} = useSelector(state => state.activate);
  const [imageAvater, setImageAvater] = useState(avater);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // image work for update
  const captureImage = (e) => {
    // file target korar por
    const file = e.target.files[0];
    // image file formate theke base 64 convart
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // image load hobar por state update 
    reader.onloadend = () => {
      setImageAvater(reader.result);
      // set avater in redux store
      dispatch(setAvater(reader.result));
    }
  }

// submit fullname and avatar in database
  const submit = async () => {
    if(!name || !avater) return;

    setLoading(true);
    try{
      const {data} = await activate({name, avater});
      if(data.isAuth){
        dispatch(setAuth(data));
      }
      setLoading(false);
    }catch(err){
      console.log(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    loading ? (<Loader message="Activation in progress ..."/>) : (
      <div className='CardCenter'>
      <Card title={`Okay, ${name}!`} icon="profile-imoji">
        <p className={styles.paragraph}>How’s this photo?</p>
        <div className={styles.imageContainer}>
          <img src={imageAvater} alt="profileImage" />
        </div>
        <input type="file" id='inputAvater' name="" style={{display: 'none'}} onChange={captureImage}/>
        <label htmlFor='inputAvater' className={styles.imageLink}>Choose a different photo</label>

        <Button text='Submit' icon='arrow-forward' onClick={submit}/>
      </Card>
    </div>
    )
  )
}

export default Avater