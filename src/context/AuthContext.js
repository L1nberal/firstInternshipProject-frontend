import { useContext, createContext, useEffect, useState } from "react";
import { 
    GoogleAuthProvider,
    signInWithPopup, 
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
    FacebookAuthProvider
} from "firebase/auth";
import { auth } from "../firebase";
  
export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('isLoggedIn')))
    const [isAdmin, setIsAdmin] = useState()

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
        localStorage.removeItem("isLoggedIn")
        setIsLoggedIn(false)
    }
    //authorize user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setIsLoggedIn(true)
                localStorage.setItem('isLoggedIn', true)

                const userInfor = {
                    name: currentUser.displayName,
                    email: currentUser.email,
                    image: currentUser.photoURL
                }
                setUser(userInfor)
                localStorage.setItem('user', JSON.stringify(userInfor))
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])   

    //database login handler
    const dataBaseLogin = (respond) => {
        const userInfor = {
            name: respond.data.user.username,
            email: respond.data.user.email
        }
        setUser(userInfor)

        if(respond.data.user.isAdmin) {
            setIsAdmin(true)
        }else{
            setIsAdmin(false)
        }

        localStorage.setItem('user', JSON.stringify(userInfor))
        localStorage.setItem('isLoggedIn', true)
        setIsLoggedIn(true)

    } 

    console.log(user)

    return (
        <AuthContext.Provider value={{isAdmin, isLoggedIn, dataBaseLogin, googleSignIn, facebookSignIn, logOut, user}}>
            {children}
        </AuthContext.Provider>  
    )
}
 
export const UserAuth = () => {
    return useContext(AuthContext)
}

