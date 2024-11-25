import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id:"",
    name:"",
    email:"",
    token:""
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuth:(state,action)=>{
            state.id = action.payload.id,
            state.name = action.payload.name,
            state.email = action.payload.email,
            state.token = action.payload.token
        },
        clearAuth:(state)=>{
            state.id = "",
            state.name = "",
            state.email = "",
            state.token = ""
        }
    }
})

export const {setAuth,clearAuth} = authSlice.actions
export default authSlice.reducer;