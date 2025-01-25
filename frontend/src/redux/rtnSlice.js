import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification:[], // [1,2,3]
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            }
        }
    }
});
export const {setLikeNotification} = rtnSlice.actions;
export default rtnSlice.reducer;