import Tippy from "@tippyjs/react/headless"
import React, { useState } from "react"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classnames from "classnames/bind"
import $ from 'jquery'
import { useNavigate } from "react-router-dom";

import style from './UserMenu.module.scss'
import { UserAuth } from "../../../context/AuthContext"
import Button from "../../Button"
import {
    icons
} from '../../../assets'

const cx = classnames.bind(style)

const UserMenu = React.forwardRef((props, ref) => {
    // ==================navigator==============
    const navigate = useNavigate()
    // ===============get logOut function from UserAuth()============
    const {logOut} = UserAuth()
    // store menu
    const [history, setHistory] = useState([props.data])
    //current usermenu
    const currentMenu = history[history.length-1]
    // index to show menuHeader
    const [menuIndex, setMenuIndex] = useState(0)
  
    return ( 
        <Tippy
            interactive
            delay={[0, 100]}
            offset={[0, 6]}
            placement='top-start'
            onHide={() => {
                setHistory([props.data])
            }}
            render={attrs => {
                return (
                    <div
                        className={cx('wrapper')}
                        id="usermenu-wrapper"
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
                                            <FontAwesomeIcon className={cx('header-icon')} icon={icons.faAngleLeft}/>
                                            {history[history.length-2][menuIndex].title}
                                        </Button>
                                    </React.Fragment>
                                }

                                {currentMenu.map((item, index) => {
                                    return (
                                        <Button 
                                            className={cx('setting-btn', `${item.reset}`, `${item.reset}-${index}`)}
                                            key={index}
                                            to={item.to}
                                            leftIcon={item.icon}
                                            onClick = {() => {
                                                if(item.submenu) {
                                                    setMenuIndex(index)
                                                    setHistory(prev => [...prev, item.submenu])
                                                }
                                                if(item.function === "logout") {
                                                    logOut()
                                                    navigate('/')
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
                                            <FontAwesomeIcon className={cx('header-icon')} icon={icons.faAngleLeft}/>
                                            {history[history.length-2][menuIndex].title}
                                        </Button>
                                    </React.Fragment>
                                }

                                {currentMenu.filter(item => item.for != "admin").map((item, index) => {
                                    return (
                                        <Button 
                                            className={cx('setting-btn')}
                                            key={index}
                                            leftIcon={item.icon}
                                            to={item.to}
                                            onClick = {() => {

                                                if(item.submenu) {
                                                    setMenuIndex(index)
                                                    setHistory(prev => [...prev, item.submenu])
                                                }
                                                if(item.function === "logout") {
                                                    logOut()
                                                    navigate('/')
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
