import React, { useState } from 'react';
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import styles from "../PhoneEmail.module.css";

const Email = ({onNext}) => {
  const [email, setEmail] = useState('');
  console.log(email);
  return (
    <Card title="Enter your email id" icon="email">

    <input type="email"
    placeholder='shakilmh626@gmail.com'
    className={styles.input}
    value={email}
    onChange={(e)=> setEmail(e.target.value)}
    />
    <Button text="Next" icon="arrow-forward" onClick={onNext}/>
    <p className={styles.paragraph}>By entering email address, you’re agreeing to our <br/>Terms of Service and Privacy Policy. Thanks!</p>

  </Card>
  )
}

export default Email;