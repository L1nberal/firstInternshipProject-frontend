import classnames from 'classnames/bind'
import Tippy from '@tippyjs/react/headless';
import React, { useEffect, useState } from 'react';

import style from './NavbarDropdownMenu.module.scss'
import Button from '../../Button';

const cx = classnames.bind(style)

const NavbarDropdownMenu = React.forwardRef((props, ref) => {
    return(
        <Tippy 
            // visible
            offset={[0,0]}
            placement='top-start'
            interactive 
            delay={[0, 100]}
            render={attrs => {
                return (
                    <div className={cx('wrapper')}>
                        {props.data.map((option, index) => {
                            return <Button key={index} className={cx('option')} >{option}</Button>
                        } )}
                    </div>
                )
                
            }}
        > 
            <span ref={ref} className={cx('list-option')}>{props.children}</span>
        </Tippy>
    )
    
}) 

export default NavbarDropdownMenu
