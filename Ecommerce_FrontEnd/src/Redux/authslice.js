import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedAdminUser = localStorage.getItem("admin_user");
 
// const initialState = {
//   user: storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null, // Ensure safe parsing
// };
const initialState = {
  user:
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser) || {} 
      : {}, 
      admin_user:
    storedAdminUser && storedAdminUser !== "undefined"
      ? JSON.parse(storedAdminUser) || {} 
      : {}, 
};
 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state, action) {
      console.log("Redux Payload: ", action.payload);

      state.user = action.payload.user; 
      state.admin_user=action.payload.admin_user
      console.log('this is inside the redux authslcice',action.payload.user)
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("admin_user", JSON.stringify(action.payload.admin_user));
    },
    clearAuthData(state) {
      state.user = null;
      state.admin_user=null;
      localStorage.removeItem("user");
      localStorage.removeItem("adm_user");
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;


// In your authSlice.js


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   isAuthenticated: false,
  
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setAuthData: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     clearAuthData: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//     // other reducers...
//   },
// });

// export const { setAuthData, clearAuthData } = authSlice.actions;
// export default authSlice.reducer;
