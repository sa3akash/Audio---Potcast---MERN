import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    avater: './images/monky.png'
}

export const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
   
    setAvater: (state, action) => {
      state.avater = action.payload;
    },
 
  },
})

// Action creators are generated for each case reducer function
export const { setName, setAvater } = activateSlice.actions;

export default activateSlice.reducer;