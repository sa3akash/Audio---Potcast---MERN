import { useCallback, useEffect, useRef } from "react";
import { socketInit } from "../socket";
import { ACTIONS } from "../socket/actions";
import { useStateWithCallBack } from "./useStateWithCallBack";
import freeice from "freeice";


export const useWebRTC = (roomId,user) => {
    
  const [clients, setClients] = useStateWithCallBack([]);
  const audioElements = useRef({})
  const connections = useRef({})
  const localMediaStream = useRef(null)

  const socket = useRef()
  const clientsRef = useRef([])


  useEffect(() => {
    socket.current = socketInit()
  },[])


  const addNewClient = useCallback(
    (newClient, cb) => {
        const lookingFor = clients.find(
            (client) => client.id === newClient.id
        );

        if (lookingFor === undefined) {
            setClients(
                (existingClients) => [...existingClients, newClient],
                cb
            );
        }
    },
    [clients, setClients]
);


  // capture audio
  useEffect(() => {
  
    const captureMedia = async () => {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({audio:true})
    }
    captureMedia().then(()=>{
        addNewClient({...user,muted:true},()=>{
            const localElement = audioElements.current[user.id]
            if(localElement) {
                localElement.volume = 0;
                localElement.srcObject = localMediaStream.current;
            }
            // join emit socket.io-client
            
            socket.current.emit(ACTIONS.JOIN,{roomId,user})

        })
    }).catch((err)=>{
        console.log("local media stream not access")
        console.log(err)
    })

    return () => {
      
      localMediaStream.current.getTracks().forEach(track=>track.stop())
      socket.current.emit(ACTIONS.LEAVE,{roomId})
    }
      
  }, [])




  const handleNewPeer = async ({peerId,createOffer,user:remoteUser}) => {

    // if already connected
    if(peerId in connections.current) {
      console.log(`your are alreay connected socketId:${peerId} and username:${user.name}`)
    }

    connections.current[peerId] = new RTCPeerConnection({
      iceServers: freeice()
    })

    // handle new icecandidate
    connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE,{peerId,icecandidate:event.candidate})
    }

    //handle on track on connetion
    connections.current[peerId].ontrack = ({streams : [remoteStreams]}) => {
      addNewClient({...remoteUser,muted:true},()=>{
        if(audioElements.current[remoteUser.id]){
          audioElements.current[remoteUser.id].srcObject = remoteStreams;
        }else{
          let settled = false;
          const intervate = setInterval(() => {
            if(audioElements.current[remoteUser.id]){
              audioElements.current[remoteUser.id].srcObject = remoteStreams;
              settled = true;
            }

            if(settled){
              clearInterval(intervate);
            }
          }, 1000);
        }
      })
    }
    
    // add local track add connetion track
    localMediaStream.current.getTracks().forEach(track=>{
      connections.current[peerId].addTrack(track,localMediaStream.current)
    })

    // create offer
    if(createOffer){
      let offer = await connections.current[peerId].createOffer()
      await connections.current[peerId].setLocalDescription(offer)
      // send offer to another client
      socket.current.emit(ACTIONS.RELAY_SDP,{peerId,sessionDescription: offer})
    }

  }

  useEffect(()=>{
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)
    return () => {
      socket.current.off(ACTIONS.ADD_PEER, handleNewPeer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  const handleRelayIce = ({peerId,icecandidate}) => {
    if(icecandidate){
      connections.current[peerId].addIceCandidate(icecandidate)
    }
  }

  // handle ice candidate
  useEffect(()=>{
    socket.current.on(ACTIONS.ICE_CANDIDATE, handleRelayIce)
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE, handleRelayIce)
    }
  },[])



  const handleSdp = async ({peerId,sessionDescription:remoteSessionDescription}) => {
    connections.current[peerId].setRemoteDescription(
      new RTCSessionDescription(remoteSessionDescription)
    )

    //// if sdp is offer then create answer
      if(remoteSessionDescription.type === "offer"){
        let answer = await connections.current[peerId].createAnswer()

        connections.current[peerId].setLocalDescription(answer)

        socket.current.emit(ACTIONS.RELAY_SDP,{peerId,sessionDescription: answer})
      }

  }

  // handle sdp
  useEffect(()=>{
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleSdp)
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION, handleSdp)
    }
  },[])



  const handleRemovePeer = ({peerId,userId}) => {
    if(connections.current[peerId]){
      connections.current[peerId].close()

      delete connections.current[peerId]
      delete audioElements.current[peerId]
      setClients(prev=>prev.filter(c=>c.id !== userId))
    }
  }

  // handle remove peer
  useEffect(()=>{
    
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER, handleRemovePeer)
    }
  },[])


  useEffect(()=>{
    clientsRef.current = clients
  },[clients])

  // lisen for mute or unmute

  const setMute = (mute,userId) => {
    const clientIdx = clientsRef.current.map(client=>client.id).indexOf(userId)

    const connectedUsers = JSON.parse(
      JSON.stringify(clientsRef.current)
    )

    if(clientIdx > -1){
      connectedUsers[clientIdx].muted = mute;
      setClients(connectedUsers)
    }
  }

  const listenMute = ({peerId,userId})=>{
    setMute(true,userId)
  }

  const listenUnMute = ({peerId,userId})=>{
    setMute(false,userId)
  }

  useEffect(()=>{
    socket.current.on(ACTIONS.MUTE, listenMute)
    socket.current.on(ACTIONS.UNMUTE, listenUnMute)

    return ()=>{
      socket.current.off(ACTIONS.MUTE, listenMute)
      socket.current.off(ACTIONS.UNMUTE, listenUnMute)
    }
  },[])



   const handleMute = (isMuted,userId) => {
    //localMediaStream.current.getTracks()[0].enabled = !isMuted;
    let settled = false;
    const intervate = setInterval(() => {
      if(localMediaStream.current){
        localMediaStream.current.getTracks()[0].enabled = !isMuted;
        settled = true;
        if(isMuted){
          socket.current.emit(ACTIONS.MUTE,{roomId,userId})
        }else{
          socket.current.emit(ACTIONS.UNMUTE,{roomId,userId})
        }
      }

      if(settled){
        clearInterval(intervate);
      }
    }, 200);
  }



  const provideRef = (instance,userId) => {
    audioElements.current[userId] = instance;
  }

  return { clients,provideRef,handleMute };
};
