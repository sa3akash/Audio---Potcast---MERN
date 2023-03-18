import React, { useState } from 'react'
import {createRoom as create} from "../../http"
import {useNavigate} from "react-router-dom"
import styles from "./OpenModal.module.css";
import Loader from "../Loader/Loader";

const OpenModal = ({setOpenModal}) => {
    const [typeRoom, setTypeRoom] = useState('public');
    const [createTopic, setCreateTopic]= useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const createRoom = async ()=>{
        if(!createTopic) return;
        setLoading(true);
        try{
            const {data} = await create({createTopic, typeRoom});
            navigate(`/room/${data._id}`);
            setLoading(false);
        }catch(err){
            console.log(err.message)
            setLoading(false);
        }
    }
  return (
    loading ? (<Loader />) : (
        <div className={styles.modelWrapper}>
            <div className={styles.model}>
            <div className={styles.top}>
            <h3>Enter the topic to be disscussed</h3>

            <input type='text' placeholder='Create a new topic:)'
            value={createTopic} onChange={(e)=>setCreateTopic(e.target.value)}
            className={styles.OpenModalInput}/>

            <h2>Room type</h2>
            <div className={styles.roomType}>
                <div className={`${styles.typeBox} ${typeRoom === 'public' ? styles.active : ''}`} onClick={()=> setTypeRoom('public')}>
                    <img src="/images/globe.png" alt="globe" />
                    <span>Public</span>
                </div>
                <div className={`${styles.typeBox} ${typeRoom === 'social' ? styles.active : ''}`} onClick={()=> setTypeRoom('social')}>
                    <img src="/images/Users.png" alt="Users" />
                    <span>Social</span>
                </div>
                <div className={`${styles.typeBox} ${typeRoom === 'private' ? styles.active : ''}`} onClick={()=> setTypeRoom('private')}>
                    <img src="/images/Lock.png" alt="Lock" />
                    <span>Private</span>
                </div>
            </div>
            </div>

            <div className={styles.bottom}>
                <h2>Start a room, open to everyone</h2>
                <button className={styles.bottomButton} onClick={createRoom}>
                    <img src="/images/Emoji.png" alt="Emoji" />
                    <span>Let’s Go</span>
                </button>
            </div>
            <button className={styles.close} onClick={()=> setOpenModal(false)}>
                <img src="/images/close.png" alt="close"/>
            </button>
        </div>
    </div>
    )

        
  )
}

export default OpenModal