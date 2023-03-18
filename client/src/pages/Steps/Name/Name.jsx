import React, { useState } from 'react';
import Card from "../../../components/Card/Card";
import styles from "./Name.module.css";
import Button from "../../../components/Button/Button";
import {useSelector, useDispatch} from "react-redux";
import {setName} from "../../../store/activateSlice";

const Name = ({onActivate}) => {
  const {name} = useSelector(state => state.activate)
  const [fullName, setFullName] = useState(name);
  const dispatch = useDispatch();


  const nameSubmit = () => {
    if(!fullName) return;
    // set full name in stote
    dispatch(setName(fullName));
    // Pass the net components 
    onActivate()
  }

  return (
    <div className='CardCenter'>
      <Card title='What’s your full name?' icon="smile-imoji-2">
        <input type="email" placeholder='Shakil Ahmed' className={styles.input}
          value={fullName}
          onChange={(e)=> setFullName(e.target.value)}
        />
        <p className={styles.paragraph}>People use real names at <br /> codershouse :) </p>

        <Button text='Next' icon='arrow-forward' onClick={nameSubmit}/>
      
      </Card>
    </div>
  )
}

export default Name;