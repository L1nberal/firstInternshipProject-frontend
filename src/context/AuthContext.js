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

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState()
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
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            console.log('currentUser', currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value= {{googleSignIn, facebookSignIn, logOut, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}

