import { useContext, createContext, useMemo, useState, useEffect } from "react";
import { 
    GoogleAuthProvider,
    signInWithPopup, 
    signOut,
    FacebookAuthProvider,
    onAuthStateChanged,
} from "firebase/auth";
import axios from 'axios';

import { auth } from "../firebase";
import { decode } from "@firebase/util";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    // =====================user storage================
    const [passwordToken, setPasswordToken] = useState()
    // =====================user storage================
    const [user, setUser] = useState()
    // ===================check if user has logged in yet================
    const [isLogged, setIsLogged] = useState()
    // ===================check if user has logged in yet================
    const [error, setError] = useState(false)
    //=================login with google================
    // function generateToken(n) {
    //     var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    //     var token = '';
    //     for(var i = 0; i < n; i++) {
    //         token += chars[Math.floor(Math.random() * chars.length)];
    //     }
    //     setPasswordToken(token)
    // }

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        
        await signInWithPopup(auth, provider)
        //============authorize user=====================
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // ==========post the infor to databse==========
            axios.get("http://localhost:1337/api/users?populate=*",{
                headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
            }) 
                .then(async(respond) => {
                    let exist = false
                    await respond.data.map(user => {
                        if(user.email === currentUser.email) {
                            exist = true
                            //==============update username ==============
                            axios.put(`http://localhost:1337/api/users/${user.id}`, {  
                                username: currentUser.displayName,
                                avatarLink: currentUser.photoURL
                            }, {
                                headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
                            })
                                .then(respond => {})
                                .catch(error => console.log(error))
                            // ============login with database==============
                            const data = {
                                username: currentUser.displayName,
                                password: "ljdas5d4a5sd56456"
                            }
                            dataBaseLogin(data)
                        }
                    })

                    if(exist === false) {
                        axios.post('http://localhost:1337/api/auth/local/register', {  
                            username: currentUser.displayName,
                            email: currentUser.email,
                            isAdmin: false,
                            password: "ljdas5d4a5sd56456",
                            from: "Gmail",
                            avatarLink: currentUser.photoURL
                        })
                            .then(async (respond) => {
                                localStorage.setItem('accessToken', respond.data.jwt)
                                setIsLogged(true)
                                window.location.reload()
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                })
                .catch(error => console.log(error))
        })
        unsubscribe()
    }
    //login with facebook
    const facebookSignIn = () => {
        const provider = new FacebookAuthProvider();

        signInWithPopup(auth, provider)
            .then(respond => {})
            .catch(error => console.log(error))
    }
   //logout function
    const logOut = () => {
        signOut(auth)
        localStorage.removeItem("accessToken")
        setIsLogged(false)
    }
    //database login handler
    const dataBaseLogin = async (data) => {
        await axios.post('http://localhost:1337/api/auth/local', {
            identifier: data.username,
            password: data.password
        })
            .then(respond => {
                try{
                    localStorage.setItem('accessToken', respond.data.jwt)
                    setIsLogged(true)
                    window.location.reload()
                }catch(error) {
                    console.log(error)
                }
            })
            .catch(error => {
                setError(true)  
            })
    }     
        
    useMemo(() => {
        if(localStorage.getItem("accessToken")) {
            const jwt = localStorage.getItem('accessToken')
            const userId = decode(localStorage.getItem('accessToken')).claims.id
            axios.get(`http://localhost:1337/api/users/${userId}?populate=*`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                }
            )   
                .then(respond => { 
                    if(respond.data.avatar === null) {
                        setUser({
                            id: respond.data.id,
                            username: respond.data.username,
                            isAdmin: respond.data.isAdmin,
                            email: respond.data.email,
                            avatar: respond.data.avatarLink,
                            from: respond.data.from
                        })
                    }else {
                        setUser({
                            id: respond.data.id,
                            username: respond.data.username,
                            isAdmin: respond.data.isAdmin,
                            email: respond.data.email,
                            avatar: `http://localhost:1337${respond.data.avatar.url}`,
                            from: respond.data.from
                        })
                    }
                })
                .catch(error => console.log(error))
        }else if(localStorage.getItem("accessToken") === null){
            setUser()
        }
    }, [isLogged])


    return (
        <AuthContext.Provider value={{
            dataBaseLogin, 
            googleSignIn, 
            facebookSignIn, 
            logOut, 
            user,
            error,
            setError
        }}>
            {children}
        </AuthContext.Provider>  
    )
}
 
export const UserAuth = () => {
    return useContext(AuthContext)
}
