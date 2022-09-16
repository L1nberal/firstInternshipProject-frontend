import classnames from "classnames/bind"
import {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { NavbarDropdownMenu, UserMenu } from "../../../menu";
import Button from "../../../Button";
import { icons } from "../../../../assets"
import style from './Header.module.scss'
import { UserAuth } from "../../../../context/AuthContext";
import { isLoggedin } from "../../../pages/Login";

const cx = classnames.bind(style)

function Header() {
    const [organisations, setOrganisations] = useState([])
    const [categories, setCategories] = useState([])
    const { logOut } = UserAuth()
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
                    {isLoggedin ? (
                        <div className={cx('user__container')}>
                            <UserMenu><img src="https://24s.vn/hinh-dai-dien-facebook-de-thuong/imager_4107.jpg" className={cx('avatar')}/></UserMenu>
                            
                            {/* <button 
                                className={cx('log-out-btn')}
                                onClick={async() => {
                                    try {
                                        await logOut()
                                        window.location.reload(1);
                                    }catch(error) {
                                        console.log(error)
                                    }
                            }}>Log out</button> */}
                        </div>

                    ) : (
                    // ================user, before logging in==================
                        <Button className={cx('user__login-btn')} to='/login'>Login</Button>
                    )}
                    
                </div>
            </div>

        </div>
    )
}


export default Header
