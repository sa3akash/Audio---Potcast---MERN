import React from "react";
import styles from "./Card.module.css";

const Card = ({icon, title, children}) => {
  return (
    <div className={styles.Card}>
      <div className={styles.HaddingWrapper}>
        {icon && <img src={`./images/${icon}.png`} alt={icon} />}
        {title && <h1 className={styles.hadding}>{title}</h1>}
      </div>
        {children}
    </div>
  );
};

export default Card;
