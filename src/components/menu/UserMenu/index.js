import Tippy from "@tippyjs/react/headless"
import React from "react"
import classnames from "classnames/bind"

import style from './UserMenu.module.scss'
import { UserAuth } from "../../../context/AuthContext"
import Button from "../../Button"

const cx = classnames.bind(style)

const UserMenu = React.forwardRef((props, ref) => {
    const {logOut} = UserAuth()

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
                         <Button 
                                className={cx('log-out-btn')}
                                onClick={async() => {
                                    try {
                                        await logOut()
                                        window.location.reload(1);
                                    }catch(error) {
                                        console.log(error)
                                    }
                        }}>Log out</Button>
                    </div>
                )
            }}
        >
            {props.children}
        </Tippy>
    )
})

export default UserMenu
