import React, { useEffect, useState } from "react";
import styles from "./SingleRoom.module.css";
import Navigation from "../../components/Navigation/Navigation";
import { useWebRTC} from "../../hooks/useWebRTC";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoom } from "../../http";

const SingleRoom = () => {

  const [roomData, setRoomData] = useState({})
  const [isMuted, setIsMuted] = useState(true)

  const {id:roomId} = useParams()
  const {user} = useSelector(state=>state.auth)

 const {clients,provideRef,handleMute} = useWebRTC(roomId,user)

  const navigate = useNavigate()




  useEffect(() => {
    handleMute(isMuted,user.id)
  }, [handleMute, isMuted, user.id])
  


  useEffect(() => {
    const fetchRoom = async () => {
      const {data} = await getRoom(roomId)
      setRoomData(data)
    }
    fetchRoom()
  }, [roomId])
  


  const handleMuteClick = (id) => {
    if(id !== user._id) return
    setIsMuted(prev=>!prev)
  }



  return (
    <>
      <Navigation />
      <hr className={styles.hr}/>
      <div className="container">
        <button className={styles.goBack} onClick={()=>navigate(-1)}>
          <img src="/images/arrow-forward.png" alt="arrow" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.SingleRoom}>
        <div className={styles.headingWrapper}>
            <h2>{roomData?.topic}</h2>
            <div className={styles.leaveButoons}>
              <button>
                <img src="/images/hand.png" alt="hand" />
              </button>
              <button onClick={()=>navigate(-1)}>
                <img src="/images/hand2.png" alt="hand2" />
                <span>Leave quietly</span>
              </button>
            </div>
        </div>
        <div className={styles.ListWrapper}>
        {clients.map((client, index) => (
          <div key={index} className={styles.userHead}>
            <img src={client.avater} alt="avater" className={styles.userAvater}/>
            <div className={styles.mic} onClick={()=>handleMuteClick(client._id)}>
            {
              client.muted ? (<img src="/images/mic_off.png" alt="mic" />) : (<img src="/images/mic.png" alt="mic" />)
            }
              
            </div>
            <audio ref={(instance)=> provideRef(instance,client.id)} autoPlay></audio>
            <h4>{client.name}</h4>
          </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default SingleRoom;
