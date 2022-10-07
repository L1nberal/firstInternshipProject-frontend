import Tippy from "@tippyjs/react/headless"
import React, { useState } from "react"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classnames from "classnames/bind"

import style from './UserMenu.module.scss'
import { UserAuth } from "../../../context/AuthContext"
import Button from "../../Button"
import {
    faAngleLeft,
} from '../../../assets/FontAwesome'

const cx = classnames.bind(style)

const UserMenu = React.forwardRef((props, ref) => {
    const {logOut} = UserAuth()
    // setting current menu on usermenu
    const [history, setHistory] = useState([props.data])
    //current usermenu
    const currentMenu = history[history.length-1]
    // index to show menuHeader
    const [menuIndex, setMenuIndex] = useState(0)
  

    return (
        <Tippy
            // visible
            interactive
            delay={[0, 100]}
            offset={[0, 6]}
            placement='top-start'
            render={attrs => {
                return (
                    <div
                        className={cx('wrapper')}
                    >
                        {props.isAdmin ? (
                            <React.Fragment>
                                {history.length > 1 && 
                                    <React.Fragment>
                                        <Button 
                                            className={cx('menu-header')}
                                            onClick={() => {
                                                setHistory(history.slice(0, history.length - 1))
                                            }}
                                        >
                                            <FontAwesomeIcon className={cx('header-icon')} icon={faAngleLeft}/>
                                            {history[history.length-2][menuIndex].title}
                                        </Button>
                                    </React.Fragment>
                                }

                                {currentMenu.map((item, index) => {
                                    return (
                                        <Button 
                                            className={cx('setting-btn')}
                                            key={index}
                                            to={item.to}
                                            onClick = {() => {
                                                if(item.submenu) {
                                                    setMenuIndex(index)
                                                    setHistory(prev => [...prev, item.submenu])
                                                }
                                                if(item.function === "logout") {
                                                    async function logout () {
                                                        try {
                                                            await logOut()
                                                            window.location.reload(1); //reload page after logout to update login state
                                                        }catch(error) {
                                                            console.log(error)
                                                        }
                                                    }
                                                    logout()
                                                }
                                            }}
                                        >
                                            {item.title}
                                        </Button>
                                    )
                                })}
                            </React.Fragment>

                        ) : (
                            
                            <React.Fragment>
                                {history.length > 1 && 
                                    <React.Fragment>
                                        <Button 
                                            className={cx('menu-header')}
                                            onClick={() => {
                                                setHistory(history.slice(0, history.length - 1))
                                            }}
                                        >
                                            <FontAwesomeIcon className={cx('header-icon')} icon={faAngleLeft}/>
                                            {history[history.length-2][menuIndex].title}
                                        </Button>
                                    </React.Fragment>
                                }

                                {currentMenu.filter(item => item.title != "management").map((item, index) => {
                                    return (
                                        <Button 
                                            className={cx('setting-btn')}
                                            key={index}
                                            onClick = {() => {
                                                if(item.submenu) {
                                                    setMenuIndex(index)
                                                    setHistory(prev => [...prev, item.submenu])
                                                }
                                                if(item.function === "logout") {
                                                    async function logout () {
                                                        try {
                                                            await logOut()
                                                            window.location.reload(1); //reload page after logout to update login state
                                                        }catch(error) {
                                                            console.log(error)
                                                        }
                                                    }
                                                    logout()
                                                }
                                            }}
                                        >
                                            {item.title} 
                                        </Button>
                                    )
                                })}
                            </React.Fragment>
                        )}
                    </div>
                )
            }}
        >
            {props.children}
        </Tippy>
    )
})

export default UserMenu
