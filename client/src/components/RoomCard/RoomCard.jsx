import React from 'react';
import styles from "./RoomCard.module.css";
import { useNavigate } from "react-router-dom";
//
const RoomCard = ({room}) => {
    const navigate = useNavigate()

  return (
    <div className={styles.RoomCardContainer} onClick={()=> navigate(`/room/${room._id}`)}>
        <h3 className={styles.topic}>{room.topic}</h3>
        <div className={`${styles.AvaterContainer} ${room.speakers.length === 1 ? styles.singleSpeaker : ''}`}>
            <div className={styles.AvaterImage}>
               {room.speakers.map(speaker => (
                <img src={speaker.avater} alt={speaker.name} key={speaker._id}/>
               ))}
            </div>
            <div className={styles.AvaterName}>
                {room.speakers.map(speaker => (
                    <div className={styles.nameWrapper} key={speaker._id}>
                        <span>{speaker.name}</span>
                        <img src="/images/chat.png" alt="chat" />
                    </div>
                    
                ))}
            </div>
        </div>

        <div className={styles.peopleCount}>
            <span>{room.totalPeople}</span>
            <img src="/images/people.png" alt="people" />
        </div>
    </div>
  )
}

export default RoomCard;