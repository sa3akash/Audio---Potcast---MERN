import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: JSON.parse(localStorage.getItem("isAuth")) || false,
    user: JSON.parse(localStorage.getItem("user")) || null,
    otp: {
        phone: "",
        hash: ""
    }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const {user, isAuth} = action.payload;
      state.user = user;
      state.isAuth = isAuth;
    },
   
    setOtp: (state, action) => {
      // logic
      const {phone, hash} = action.payload;
      state.otp.phone = phone;
      state.otp.hash = hash;
    },
 
  },
})

// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;