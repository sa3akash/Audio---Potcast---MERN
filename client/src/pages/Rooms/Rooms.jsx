import React, { useEffect, useState } from 'react';
import RoomCard from '../../components/RoomCard/RoomCard';
import styles from "./Rooms.module.css";
import OpenModal from '../../components/OpenModal/OpenModal';
import { getAllRooms } from '../../http';
import Loader from '../../components/Loader/Loader';
import Navigarion from "../../components/Navigation/Navigation"

// const rooms = [
//   {
//       id: 1,
//       topic: 'Which framework best for frontend ?',
//       totalPeople: 40,
//       speakers: [
//           {
//               id: 1,
//               name: 'Jonathan Wolfe',
//               avater: '/images/monky.png'
//           },
//           {
//               id: 2,
//               name: 'Anushka Sharma',
//               avater: '/images/monky.png'
//           }
//       ]
//   },
//   {
//       id: 2,
//       topic: 'What’s new in machine learning',
//       totalPeople: 60,
//       speakers: [
//           {
//               id: 1,
//               name: 'John Doe',
//               avater: '/images/monky.png'
//           },
//           {
//               id: 2,
//               name: 'Anushka Sharma',
//               avater: '/images/monky.png'
//           }
//       ]
//   },
//   {
//       id: 3,
//       topic: 'Why people use stack overflow',
//       totalPeople: 20,
//       speakers: [
//           {
//               id: 1,
//               name: 'Virat Kohli',
//               avater: '/images/monky.png'
//           },
//           {
//               id: 2,
//               name: 'Shawn  Dell',
//               avater: '/images/monky.png'
//           }
//       ]
//   },
//   {
//       id: 4,
//       topic: 'What’s new in machine learning',
//       totalPeople: 80,
//       speakers: [
//           {
//               id: 1,
//               name: 'Virat Kohli',
//               avater: '/images/monky.png'
//           },
//           {
//               id: 2,
//               name: 'Anushka Sharma',
//               avater: '/images/monky.png'
//           }
//       ]
//   },
// ]



const Rooms = () => {
    const [openModal, setOpenModal] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [dataRender, setDataRender] = useState(false);


    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try{
                const {data} = await getAllRooms();
                setRooms(data);
                setLoading(false);
            }catch(err){
                console.log(err.message);
                setLoading(false);
            }
        }
        fetchRooms();   
    },[])

  return (
    loading ? (<Loader/> ) :
    <>
    <Navigarion/>
    <div className='container'>
        <div className={styles.roomsHeader}>
            <div className={styles.roomsLeft}>
                <span className={styles.roomsLeftHeading}>All voice rooms</span>
                <div className={styles.roomsLeftInputBox}>
                <img src="./images/search.png" alt="search" />
                <input type="text" />
                </div>
            </div>
            <button className={styles.roomsRightButton} onClick={()=> setOpenModal(true)}>
                <img src="./images/room.png" alt="room" />
                <span>Start a room</span>
            </button>
        </div>
        <div className={styles.roomsLists} >
            {rooms?.map(room => <RoomCard room={room} key={room._id}/>)}
        </div>
    </div>
    {openModal && (<OpenModal setOpenModal={setOpenModal}/>)}
    </>
  )
}

export default Rooms;