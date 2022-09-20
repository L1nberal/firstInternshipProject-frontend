import Tippy from "@tippyjs/react/headless"
import React from "react"
import classnames from "classnames/bind"

import style from './UserMenu.module.scss'
import { UserAuth } from "../../../context/AuthContext"
import Button from "../../Button"

const cx = classnames.bind(style)

const UserMenu = React.forwardRef((props, ref) => {
    const {logOut} = UserAuth()
    console.log(props.isAdmin)

    const admin = true
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
                        {!props.isAdmin ? (
                            <Button 
                                   className={cx('log-out-btn')}
                                   onClick={async() => {
                                       try {
                                           await logOut()
                                           window.location.reload(1); //reload page after logout to update login state
                                       }catch(error) {
                                            console.log(error)
                                       }
                           }}>Log out</Button>

                        ) : (
                            <>
                                <Button 
                                    className={cx('setting-btn')}
                                    to='/setting'
                                >Settings</Button>

                                <Button 
                                    className={cx('log-out-btn')}
                                    onClick={async() => {
                                        try {
                                            await logOut()
                                            window.location.reload(1); //reload page after logout to update login state
                                        }catch(error) {
                                            console.log(error)
                                            }
                                }}>Log out</Button>
                            </>
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