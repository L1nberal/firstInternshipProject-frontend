import classnames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import React from 'react';
import { Sidebar, Menu, MenuItem, useProSidebar, ProSidebarProvider } from 'react-pro-sidebar';

import style from './NavbarDropdownMenu.module.scss';
import Button from '../../Button';
import { icons } from '../../../assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classnames.bind(style);

const NavbarDropdownMenu = React.forwardRef((props, ref) => {
    return (
        <React.Fragment>
            <div className={cx('wrapper')}>
                <Tippy
                    offset={[0, 0]}
                    placement="top-start"
                    interactive
                    delay={[0, 100]}
                    render={(attrs) => {
                        return (
                            <div className={cx('options-container')}>
                                {props.data.submenu.map((option, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            className={cx('option')}
                                            to={`${props.to}-${option.id}`}
                                            state={{ data: option }}
                                        >
                                            {option.attributes.name}
                                        </Button>
                                    );
                                })}
                            </div>
                        );
                    }}
                >
                    <span ref={ref} className={cx('list-option')}>
                        {props.children}
                    </span>
                </Tippy>
            </div>

            {/* ==============for tablets and mobiles use============ */}
            <div className={cx('sidebar-wrapper')}>
                {props.children}

                <div className={cx('option-menu')}>
                    {props.data.submenu.map((option, index) => {
                        return (
                            <Button
                                key={index}
                                className={cx('option')}
                                to={`${props.to}-${option.id}`}
                                state={{ data: option }}
                            >
                                {option.attributes.name}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
});

export default NavbarDropdownMenu;
