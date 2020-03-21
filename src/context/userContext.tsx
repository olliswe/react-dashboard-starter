import React, {createContext, Dispatch} from 'react'
import {User} from "../types";


const UserContext = createContext<UserContextProps>({} as UserContextProps)


export type UserContextState = {
    user:User|null,
    token:string|null,
    isAuthenticated:boolean,
    loading:boolean
}

export type UserContextAction =
     { type: 'logout' }
    | { type: 'login', payload:{user:User, token:string}}
    | { type: 'loaded'};

export type UserContextProps = {state:UserContextState,dispatch:Dispatch<UserContextAction>}


let initialState:UserContextState = {
    user:null,
    token:null,
    isAuthenticated:false,
    loading:true,
};

const storeToken = (token:string)=>{
    localStorage.setItem('token',token)
}

let reducer = (state:UserContextState, action:UserContextAction) => {

    switch (action.type) {
        case "logout":
            localStorage.removeItem('token')
            return {user:null, token:null, isAuthenticated: false, loading:false};
        case "login":
            storeToken(action.payload.token)
            return { user:action.payload.user, token:action.payload.token, isAuthenticated:true, loading:false }
        case "loaded":
            return { ...state, loading:false }
    }
};



const UserContextProvider:React.FC = (props) => {
    // [A]
    let [state, dispatch] = React.useReducer(reducer, initialState);
    let value = { state, dispatch };


    // [B]
    return (
        <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
    );
}


let UserContextConsumer = UserContext.Consumer;

const withUserContext = (WrappedComponent:React.FC) => {
    return (
        function (props:any) {
            return (
                <UserContextProvider><WrappedComponent {...props}/></UserContextProvider>
            )
        }
    );
};


export { UserContext, UserContextProvider, UserContextConsumer, withUserContext };
