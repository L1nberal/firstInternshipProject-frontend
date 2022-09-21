import { useContext, createContext, useEffect, useState } from "react";
import { 
    GoogleAuthProvider,
    signInWithPopup, 
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
    FacebookAuthProvider
} from "firebase/auth";
import axios from 'axios';

import { auth } from "../firebase";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    // const [userInfor, setUserInfor] = useState()

    //login with google
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
        // signInWithRedirect(auth, provider)
    }
    //login with facebook
    const facebookSignIn = () => {
        const provider = new FacebookAuthProvider()
        signInWithPopup(auth, provider)
    }
   //logout function
    const logOut = () => {
        signOut(auth)
        localStorage.removeItem("user")
    }

    //authorize user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser)
                localStorage.setItem('user', JSON.stringify(currentUser))
                
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])   
    //database login handler
    const dataBaseLogin = (respond) => {
        axios.get(
            `http://localhost:1337/api/users/${respond.data.user.id}?populate=*`,
            {headers: { Authorization: `Bearer ${respond.data.jwt}` }}
        )   
            .then(respond => {
                const userInfor = {
                    displayName: respond.data.username,
                    isAdmin: respond.data.isAdmin,
                    jwt: respond.data.jwt,
                    email: respond.data.email,
                    photoURL: `http://localhost:1337${respond.data.avatar.url}`,
                }
                console.log(userInfor)
                setUser(userInfor)
                localStorage.setItem('user', JSON.stringify(userInfor))
            })
            .catch(error => console.log(error))
    } 
    return (
        <AuthContext.Provider value={{dataBaseLogin, googleSignIn, facebookSignIn, logOut, user}}>
            {children}
        </AuthContext.Provider>  
    )
}
 
export const UserAuth = () => {
    return useContext(AuthContext)
}

