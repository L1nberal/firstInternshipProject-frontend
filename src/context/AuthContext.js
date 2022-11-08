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
    // =====================user storage================
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
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
                    let exist = false
                    await respond.data.map(user => {
                        if(user.email === currentUser.email) {
                            exist = true
                            //==============update gmail infor==============
                            axios.put(`http://localhost:1337/api/users/${user.id}`, {  
                                username: currentUser.displayName,
                            }, {
                                headers: { Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` }
                            })
                                .then(respond => {})
                                .catch(error => console.log(error))

                            const userInfor = {
                                id: user.id,
                                username: currentUser.displayName,
                                isAdmin: user.isAdmin,
                                email: user.email,
                                avatar: currentUser.photoURL,
                                from: user.from
                            }
                            setUser(userInfor)
                            localStorage.setItem('user', JSON.stringify(userInfor))
                        }
                    })
                    if(exist === false) {
                        axios.post('http://localhost:1337/api/auth/local/register', {  
                            username: currentUser.displayName,
                            email: currentUser.email,
                            isAdmin: false,
                            password: "ljdas5d4a5sd56456",
                            from: "Gmail",
                        })
                            .then((respond) => {
                                const userInfor = {
                                    id: respond.data.user.id,
                                    username: respond.data.user.username,
                                    isAdmin: respond.data.user.isAdmin,
                                    email: respond.data.user.email,
                                    avatar: currentUser.photoURL,
                                    from: "Gmail"
                                }
                                setUser(userInfor)
                                localStorage.setItem('user', JSON.stringify(userInfor))
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
        localStorage.removeItem("user")
    }
    //database login handler
    const dataBaseLogin = (respond) => {
        // console.log(respond)
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
                    from: respond.data.from
                }
                setUser(userInfor)
                localStorage.setItem('user', JSON.stringify(userInfor))
                // window.location.reload()
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
        }}>
            {children}
        </AuthContext.Provider>  
    )
}
 
export const UserAuth = () => {
    return useContext(AuthContext)
}