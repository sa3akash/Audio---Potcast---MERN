import React, { useState } from 'react';
import PhoneEmail from "../Steps/PhoneEmail/PhoneEmail";
import Otp from "../Steps/Otp/Otp";


const steps = {
  1: PhoneEmail,
  2: Otp,
}

const Authenticate = () => {
  const [step, setStep] = useState(1);
  const Component = steps[step];

  const onNext = () => {
    setStep(step + 1);
  }
  return (
    <div><Component onNext={onNext}/></div>
  )
}

export default Authenticate;