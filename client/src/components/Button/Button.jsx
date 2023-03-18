import React from 'react';
import styles from "./Button.module.css";

const Button = ({text, icon, onClick, ...props}) => {
  return (
    <button className={styles.ButtonContent} {...props} onClick={onClick}>
        <span>{text}</span>
        <img src={`./images/${icon}.png`} alt="arrow-forward" />
    </button>
  )
}

export default Button;