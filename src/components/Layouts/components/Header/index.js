import classnames from "classnames/bind"
import {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from "react";

import { NavbarDropdownMenu, UserMenu } from "../../../menu";
import Button from "../../../Button";
import { icons } from "../../../../assets"
import style from './Header.module.scss'
import { AuthContext } from "../../../../context/AuthContext";


const cx = classnames.bind(style)

function Header() {
    const { isLoggedIn, isAdmin, user } = useContext(AuthContext)
    const [organisations, setOrganisations] = useState([])
    const [categories, setCategories] = useState([])
    let newOrganisations = []
    let newCategories = []

    useEffect(() => {
    // =============get organisations from strapi API=============
        fetch('http://localhost:1337/api/organisations')
        .then(response => response.json())
        .then(data => {
            Object.values(data)[0].map(organisation => {
                setOrganisations(() => {
                    newOrganisations = [...newOrganisations, organisation.attributes.name]
                    return newOrganisations
                })
            })

        }) 
    // =============get categories from strapi API=============
        fetch('http://localhost:1337/api/categories')
        .then(response => response.json())
        .then(data => {
            Object.values(data)[0].map(category => {
                setCategories(() => {
                    newCategories = [...newCategories, category.attributes.name]
                    return newCategories
                })
            })
        })
    }, []) 
 
    const navBarList = [
        {
            title: 'Trang chủ',
            to: '/'
        },
        {
            title: 'Cơ quan/địa phương', 
            submenu: organisations,
        },
        {
            title: 'Thể loại',
            submenu: categories,
        }, 
        {
            title: 'Liên hệ',
            to: '/contact-us'
        },  

    ]   
    

    return(
        <div className={cx('wrapper')}>
            {/* ================= right part of the header ============== */}
            <div className={cx('wrapper__right')}>
                {/* ================logo=============== */}
                <img className={cx('logo')} src="https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK"/>
                {/* ===============navbar============= */}
                <nav>
                    <ul>
                        {navBarList.map((listOption, index) => {
                            return(
                                <span key={index}>
                                    {listOption.submenu ? (
                                        <NavbarDropdownMenu data={listOption.submenu}>
                                            <Button key={index} className={cx('list-option')} to={listOption.to}>{listOption.title}</Button>
                                        </NavbarDropdownMenu>
                                    ):(
                                        <Button key={index} className={cx('list-option')} to={listOption.to}>{listOption.title}</Button>
                                    )}
                                </span>
                            ) 
                        })}
                    </ul>
                </nav>
            </div>
            {/* ================= left part of the header ============== */}
            <div className={cx('wrapper__left')}>
                {/* ===============search-container============== */}
                <div className={cx('search')}>
                    <input className={cx('search__input')} type="text" placeholder="type something..." />
                    <FontAwesomeIcon className={cx('search__icon')} icon={icons.faMagnifyingGlass} />
                </div>  
                {/* ==================user-container============= */}
                <div className={cx('user')}>
                    {/* ======================user, after logging in============= */}
                    {isLoggedIn ? (
                        <div className={cx('user__container')}>
                            <UserMenu isAdmin={isAdmin}>
                                <div className={cx('user__container')}>
                                    <img src={user.image} className={cx('avatar')}/>
                                    <span className={cx('username')}>{user.name}</span>
                                </div>
                            </UserMenu>
                        </div>

                    ) : (
                    // ================user, before logging in==================
                       <div>
                            <Button className={cx('user__login-btn')} to='/log-in'>Login</Button>
                       </div>
                    )}
                    
                </div>
            </div>

        </div>
    )
}


export default Header
