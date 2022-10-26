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
import { async } from "@firebase/util";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    //=================login with google================
    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        
        await signInWithPopup(auth, provider)
        
        //============authorize user=====================
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            let numberOfUsers = 0
            console.log(currentUser)
            // ==========post the infor to databse==========
            axios.get("http://localhost:1337/api/other-login-methods-users",{
                headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
            }) 
                .then(async(respond) => {
                    await respond.data.data.map(user => {
                        if(user.attributes.email ===  currentUser.email) {
                            if(user.attributes.username != currentUser.displayName) {
                                console.log('submitted')
                                axios.put(`http://localhost:1337/api/other-login-methods-users/${user.id}`, {
                                    data: {
                                        username: currentUser.displayName
                                    }
                                }, {
                                    headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
                                })
                                    .then(respond => console.log(respond))
                                    .catch(error => console.log(error))
                            }
                            if(user.attributes.avatarLink != currentUser.photoURL) {
                                console.log('submitted')

                                axios.put(`http://localhost:1337/api/other-login-methods-users/${user.id}`, {
                                    data: {
                                        avatarLink: currentUser.photoURL
                                    }
                                }, {
                                    headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
                                })              
                                    .then(respond => console.log(respond))
                                    .catch(error => console.log(error))             
                            }
                            numberOfUsers++
                        }
                    })

                    if(numberOfUsers === 0) {
                        axios.post("http://localhost:1337/api/other-login-methods-users", {
                            data: {
                                username: currentUser.displayName,
                                email: currentUser.email,
                                avatarLink: currentUser.photoURL,
                                isAdmin: false,
                                fromDatabase: false,
                            }
                        }, {
                            headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
                        })
                            .then(respond => {
                                const userInfor= {
                                    id: respond.data.data.id,
                                    username: respond.data.data.attributes.username,
                                    isAdmin: respond.data.data.attributes.isAdmin,
                                    email: respond.data.data.attributes.email,
                                    avatar: `${respond.data.data.attributes.avatarLink}`,
                                    fromDatabase: respond.data.data.attributes.fromDatabase
                                }
                                setUser(userInfor)
                                localStorage.setItem('user', JSON.stringify(userInfor))
                            })
                            .catch(error => console.log(error))
                    }else if(numberOfUsers > 0) {
                        axios.get("http://localhost:1337/api/other-login-methods-users",{
                            headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
                        }) 
                            .then(respond => {
                                respond.data.data.map(user => {
                                    if(user.attributes.email === currentUser.email) {
                                        const userInfor= {
                                            id: user.id,
                                            username: user.attributes.username,
                                            isAdmin: user.attributes.isAdmin,
                                            email: user.attributes.email,
                                            avatar: `${user.attributes.avatarLink}`,
                                            fromDatabase: user.attributes.fromDatabase
                                        }
                                        setUser(userInfor)
                                        localStorage.setItem('user', JSON.stringify(userInfor))
                                    }
                                })
                            })
                            
                          
                        

                    }
                })
                .catch(error => console.log(error))
        })
        return () => {
            unsubscribe()
        } 
    }
    //login with facebook
    const facebookSignIn = () => {
        
        const provider = new FacebookAuthProvider();

        // signInWithPopup(auth, provider)
        signInWithPopup(auth, provider)
            .then(respond => console.log(respond))
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
                    fromDatabase: true,
                    avatar: `http://localhost:1337${respond.data.avatar.url}`,
                }
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

