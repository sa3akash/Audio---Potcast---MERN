import {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setAuth} from "../store/userSlice";

export function useLoadingWithRefresh(){
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch(true);

    useEffect(()=>{

        (async()=>{
            setLoading(true)
            try{
                
                const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh`, {
                    withCredentials: true,
                })

                dispatch(setAuth(data))
                setLoading(false)
        
            }catch(error){
                console.log(error.message);
                setLoading(false)
            }
        })();

    },[])

    return {loading}

}


