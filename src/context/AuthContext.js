import { useContext, createContext, useMemo, useState } from "react";
import { 
    GoogleAuthProvider,
    signInWithPopup, 
    signOut,
    FacebookAuthProvider,
    onAuthStateChanged,
} from "firebase/auth";
import axios from 'axios';

import { auth } from "../firebase";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    // =================store user email ===============
    const [from, setFrom] = useState('')
    // =================store user email ===============
    const [userEmail, setUserEmail] = useState()
    // =====================user storage================
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    // =====================check if the user exists for other login methods=========
    const [emailExist, setEmailExist] = useState()
    //=================login with google================
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
                    await respond.data.map(user => {
                        if(user.email === currentUser.email) {
                            setEmailExist(true)
                            const userInfor = {
                                id: user.id,
                                username: user.username,
                                isAdmin: user.isAdmin,
                                email: user.email,
                                avatar: `http://localhost:1337${user.avatar.url}`,
                            }
                            setUser(userInfor)
                            localStorage.setItem('user', JSON.stringify(userInfor))
                        }else {
                            setEmailExist(false)
                            setUserEmail(
                                currentUser.email
                            )
                            setFrom('Gmail')
                        }
                    })
                })
                .catch(error => console.log(error))
        })

        unsubscribe()
    }
    //login with facebook
    const facebookSignIn = () => {
        
        const provider = new FacebookAuthProvider();

        // signInWithPopup(auth, provider)
        signInWithPopup(auth, provider)
            .then(respond => {})
            .catch(error => console.log(error))
    }

   //logout function
    const logOut = () => {
        signOut(auth)
        localStorage.removeItem("user")
    }

    // logOut()         
    //database login handler
    const dataBaseLogin = (respond) => {
        axios.get(
            `http://localhost:1337/api/users/${respond.data.user.id}?populate=*`, {
                headers: { Authorization: `Bearer ${respond.data.jwt}` }
            }
        )   
            .then(respond => {
                const userInfor = {
                    id: respond.data.id,
                    username: respond.data.username,
                    isAdmin: respond.data.isAdmin,
                    email: respond.data.email,
                    avatar: `http://localhost:1337${respond.data.avatar.url}`,
                }
                setUser(userInfor)
                localStorage.setItem('user', JSON.stringify(userInfor))
                window.location.reload()
            })
            .catch(error => console.log(error))
    } 
    
    return (
        <AuthContext.Provider value={{
            dataBaseLogin, 
            googleSignIn, 
            facebookSignIn, 
            logOut, 
            user,
            emailExist,
            userEmail,
            setEmailExist,
            from
        }}>
            {children}
        </AuthContext.Provider>  
    )
}
 
export const UserAuth = () => {
    return useContext(AuthContext)
}

