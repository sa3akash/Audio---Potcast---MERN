import React, { useState } from 'react';
import Email from "./Email/Email";
import Phone from "./Phone/Phone";
import styles from "./PhoneEmail.module.css";


const steps = {
  phone: Phone,
  email: Email
}

const PhoneEmail = ({onNext}) => {
  const [type, setType] = useState('phone');

  const Component = steps[type];

  return (
    <div className={`${styles.CardWrapper} phoneCardEmail`}>
      <div className={styles.ButtonWrapper}>
          <button onClick={() => setType('phone')} className={type === "phone" ? styles.active : ""}>
            <img src="./images/phone-0.png" alt="phone" />
            </button>
          <button onClick={() => setType('email')} className={type === "email" ? styles.active : ""}>
            <img src="./images/email-0.png" alt="email"/>
          </button>
        </div>
        <Component onNext={onNext}/>
    </div>
  )
}

export default PhoneEmail