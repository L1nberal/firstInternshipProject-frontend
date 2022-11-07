import classnames from "classnames/bind"
import {useEffect, useMemo, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import $ from 'jquery';
import Spinner from 'react-bootstrap/Spinner';
import { GoogleMap, useLoadScript, Marker  } from '@react-google-maps/api';

import { NavbarDropdownMenu, UserMenu } from "../../../menu";
import Button from "../../../Button";
import { icons } from "../../../../assets"
import style from './Header.module.scss'
import { AuthContext } from "../../../../context/AuthContext";
import {faX } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(style)

function Header() { 
    // ===========get current logged user=============
    const { user } = useContext(AuthContext)
    // ============== get current logged user id for accessing private page =====0
    const [currentUser, setCurrentUser] = useState(0)
    useMemo(() => {
        if(user) {
            setCurrentUser(user.id)
        }
    }, [user])
    // =============get infor from api================
    const [organisations, setOrganisations] = useState([])
    const [categories, setCategories] = useState([])
    const [apps, setApps] = useState([])
    let newOrganisations = []
    let newCategories = []
    let newApps = []
    // for searching
    const [query, setQuery] = useState('') 

    useEffect(() => {
    // =============get organisations from strapi API=============
        fetch('http://localhost:1337/api/apps?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(app => {
                    setApps(() => {
                        newApps = [...newApps, app]
                        return newApps
                    })
                })
            }) 

    // =============get apps from strapi API=============
        fetch('http://localhost:1337/api/organisations?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(organisation => {
                    setOrganisations(() => {
                        newOrganisations = [...newOrganisations, organisation]
                        return newOrganisations
                    })
                })

            }) 
        

    // =============get categories from strapi API=============
        fetch('http://localhost:1337/api/categories?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(category => {
                    setCategories(() => {
                        newCategories = [...newCategories, category]
                        return newCategories
                    })
                })
            })
    }, []) 
    // ordering categories to prioritize some scrucial ones
    let temporary
    for(let i = 0; i < categories.length-1; i++) {
        for(let j = i + 1; j < categories.length; j++) {
            if(categories[i].attributes.ordered > categories[j].attributes.ordered) {
                temporary = categories[i]
                categories[i] = categories[j]
                categories[j] = temporary
            }
        }
    } 

    //Navbar List
    const navBarList = [
        {
            title: 'Trang chủ',
            to: '/'
        },
        {
            title: 'Cơ quan/địa phương', 
            submenu: organisations,
            to: `/organisation-details`
        },
        {
            title: 'Thể loại',
            submenu: categories,
            to:'/category'
        }, 
        {
            title: 'Liên hệ',
        },  
    ]   

    // User list of options
    const userOptions = [
        {
            title: "Ngôn ngữ",
            icon: icons.faEarthAsia,
            submenu: [
                {
                    title: "Tiếng Việt",
                },
                {
                    title: "English",
                },
            ]
        },
        {
            title: "Quản lý",
            icon: icons.faFileInvoice,
            for: "admin",
            submenu: [
                {
                    title: "Thêm cơ quan",
                    to: "/add-organisations",
                },
                {
                    title: "Thêm ứng dụng",
                    to: "/add-apps",
                },
                {
                    title: "Thêm thể loại",
                    to: "/add-categories",
                }
            ]
        },
        {
            title: "Trang cá nhân",
            icon: icons.faListCheck,
            to: `/private-page-${currentUser}`
        },
        {
            title: "Đăng xuất",
            function: "logout",
            icon: icons.faRightToBracket,
        }
    ]

    // ================Search feature=================
    // search results are displayed when typing
    
    useEffect(() => {
        const searchResults = document.getElementById('search-results')
        if(query.length > 0 ){
            searchResults.style.visibility = "visible"
        }else if(query.length === 0) {
            searchResults.style.visibility = "hidden"
        }   
    }, [query])
    // search bar handler
    const searchEngineHandler = () => {
        const searchResults = document.getElementById('search-results')
        setQuery('')
        searchResults.style.visibility = "hidden"
    }
    // ==============contact=================
    $('#list-option-3').hover(function() {
        document.getElementById('contact').style.visibility = "visible"
        document.getElementById('contact').style.opacity = "1"
    }, function() {
        document.getElementById('contact').style.visibility = "hidden"
        document.getElementById('contact').style.opacity = "0"
    })

    $('#contact').hover(function() {
        document.getElementById('contact').style.visibility = "visible"
        document.getElementById('contact').style.opacity = "1"
    }, function() {
        document.getElementById('contact').style.visibility = "hidden"
        document.getElementById('contact').style.opacity = "0"
    }) 

    // ===============gg map===================
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: `AIzaSyCe2LvWG408VgKLfrd_p01eOZo-DFJTo8s`    
    })
    
    const center = {
        lat: 16.459228872399986,
        lng: 107.58130201122881
    }

    return(
        <div className={cx('wrapper')}>
            {/* ================= right part of the header ============== */}
            <div className={cx('wrapper__left')}>
                {/* ================logo=============== */}
                <img className={cx('logo')} src="https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK"/>
                {/* ===============navbar for computers============= */}
                <nav className={cx('nav-bar')}>
                    <FontAwesomeIcon 
                        icon={icons.faBars} 
                        className={cx('nav-bar__icon')}
                    />

                    <ul className={cx('nav-bar__container')}>
                        {/* ================nav-bar logo=============== */}
                        <img className={cx('nav-bar__container-logo')} src="https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK"/>
                        
                        {navBarList.map((listOption, index) => {
                            return(
                                <span key={index} id={`list-option-${index}`} className={cx('list-option-container')}>
                                    {listOption.submenu ? (
                                        <NavbarDropdownMenu data={listOption} to={listOption.to}>
                                            <Button key={index} className={cx('list-option')}>{listOption.title}</Button>
                                        </NavbarDropdownMenu>
                                    ):(
                                        <Button key={index} className={cx('list-option')} to={listOption.to} >
                                            {listOption.title} 
                                        </Button>
                                    )}
                                </span>
                            ) 
                        })}
                        {/* ===============contact infor of the management of the website========== */}
                        <div className={cx('contact')} id="contact">
                            <div className={cx('wrapper')}>
                                <div className={cx('wrapper__left')}>
                                    <h6 className={cx('title')}>Cơ quan quản lý: HueCIT</h6>
                                    <div className={cx('infor')}>
                                        <div>
                                            <h6>Liên hệ:</h6>
                                            E-mail: <p>info@huecit.vn</p>
                                            Website: <a href="https://www.huecit.vn/">www.huecit.vn</a>
                                        </div>
                                        <div>
                                            <h6>DỊCH VỤ</h6>
                                            <p>0234.3 823 077 nhánh số 19</p>
                                            <h6>ĐÀO TẠO</h6>
                                            <p>0234.390 7777</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('wrapper__right')}>
                                    {!isLoaded ? (
                                        <Spinner 
                                            animation="border" 
                                            role="status"
                                            className={cx('spinner')}
                                        >
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    ) : (
                                        <GoogleMap
                                            mapContainerClassName={cx('map')}
                                            center={center}
                                            zoom={20}
                                        >
                                            <Marker
                                                position={{lat: 16.459228872399986,
                                                    lng: 107.58130201122881}}    
                                            />
                                        </GoogleMap>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ul>
                </nav>
            </div>
            {/* ================= left part of the header ============== */}
            <div className={cx('wrapper__right')}>
                {/* ===============search-container============== */}
                <div className={cx('search-engine')} id="search-engine">
                    <div className={cx('search-container')} id="search-container">
                        <div className={cx('search-bar')} id='search-bar'>
                            <input 
                                value={query}
                                className={cx('search__input')} 
                                id="search-input"
                                type="text" 
                                placeholder="type something..." 
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        {/* ====================search results==================== */}
                        <div className={cx('search-results')} id="search-results">
                            {apps.map(app => {
                                return(
                                    <React.Fragment key={app.id}>
                                        {/* =============search by lower case letters============= */}
                                        {app.attributes.name.toLowerCase().includes(query) && 
                                            <ListGroup variant="flush" className="each-item">
                                                <Link to={`/app-details-${app.id}`} onClick={() => searchEngineHandler()}><ListGroup.Item>{app.attributes.name}</ListGroup.Item></Link>
                                            </ListGroup>
                                        }
                                        {/* ===========search by upper case letters================== */}
                                        {app.attributes.name.toUpperCase().includes(query) && 
                                            <ListGroup variant="flush" className="each-item">
                                                <Link to={`/app-details-${app.id}`} onClick={() => searchEngineHandler()}><ListGroup.Item>{app.attributes.name}</ListGroup.Item></Link>
                                            </ListGroup>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
                {/* ==================user-container============= */}
                <div className={cx('user')}>
                    {/* ======================user, after logging in============= */}
                    {user ? (
                        <div className={cx('user__container')} id="user-container">
                            <UserMenu isAdmin={user.isAdmin} data={userOptions}>
                                <div className={cx('user__container')}>
                                    <img src={user.avatar} className={cx('avatar')}/>
                                    <span className={cx('username')}>{user.username}</span>
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
