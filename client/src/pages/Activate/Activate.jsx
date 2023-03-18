import React, { useState } from 'react';
import Name from "../Steps/Name/Name";
import Avater from "../Steps/Avater/Avater";


const steps = {
  1: Name,
  2: Avater,
}
const Activate = () => {
  const [step, setStep] = useState(1);
  const Component = steps[step];

  const onActivate = () => {
    setStep(step + 1);
  }
  return (
    <div><Component onActivate={onActivate}/></div>
  )
}

export default Activate;