import axios from "axios";


const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "content-type": "application/json"
    }
})

// list of all endpoint

export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (date) => api.post('/api/activate', date);
export const logout = () => api.post('/api/logout');
export const createRoom = (data)=> api.post("/api/rooms", data);
export const getAllRooms = ()=> api.get("/api/rooms");
export const getRoom = (roomId)=> api.get(`/api/room/${roomId}`);




// intercepter
api.interceptors.response.use((config)=>{ return config}, async (error)=>{

    const originalRequest = error.config;

    if(error.response.status === 401 && originalRequest && !originalRequest._isRetry){
        originalRequest.isRetry = true;
        // auto refresh
        try{
            await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh`, {
                withCredentials: true,
            })
            return api.request(originalRequest);
        }catch(err){
            console.log(err.message);
        }
    }else{
        throw error;
    }
})





export default api;