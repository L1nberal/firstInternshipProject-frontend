import classnames from "classnames/bind"
import {useEffect, useState} from 'react'
import { ReactDOM } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";

import { NavbarDropdownMenu, UserMenu } from "../../../menu";
import Button from "../../../Button";
import { icons } from "../../../../assets"
import style from './Header.module.scss'
import { AuthContext } from "../../../../context/AuthContext";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(style)

function Header() {
    const { isAdmin, user } = useContext(AuthContext)
    const [organisations, setOrganisations] = useState([])
    const [categories, setCategories] = useState([])
    const [apps, setApps] = useState([])
    let newOrganisations = []
    let newCategories = []
    let newApps = []
    // for searching
    const [query, setQuery] = useState(true) 
    
    useEffect(() => {
    // =============get organisations from strapi API=============
        fetch('http://localhost:1337/api/apps?populate=*')
        .then(response => response.json())
        .then(data => {
            Object.values(data)[0].map(organisation => {
                setApps(() => {
                    newApps = [...newApps, organisation]
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

    //Navbar List
    const navBarList = [
        {
            title: 'Trang chủ',
            to: '/'
        },
        {
            title: 'Cơ quan/địa phương', 
            submenu: organisations,
            to:'/organisation-details'
        },
        {
            title: 'Thể loại',
            submenu: categories,
            to:'/category-details'
        }, 
        {
            title: 'Liên hệ',
            to: '/contact-us'
        },  
        {
            title: 'Tìm kiếm',
        }, 

    ]   

    // User list of options
    const userOptions = [
        {
            title: "Language",
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
            title: "management",
            submenu: [
                {
                    title: "Thêm cơ quan",
                    to: "/add-organisations"
                },
                {
                    title: "Thêm ứng dụng",
                    to: "/add-apps"
                },
                {
                    title: "Thêm thể loại",
                    to: "/add-categories"
                }
            ]
        },
        {
            title: "Log out",
            function: "logout"
        }
    ]

    // ================Search feature=================
    // search results are displayed when typing
    const searchResults = document.getElementById('search-results')
    
    if(query != true){
        searchResults.style.display = "block"
            
        if(!query) {
            searchResults.style.display = "none"
        }  
    } 
    

    return(
        <div className={cx('wrapper')}>
            {/* ================= right part of the header ============== */}
            <div className={cx('wrapper__left')}>
                {/* ================logo=============== */}
                <img className={cx('logo')} src="https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK"/>
                {/* ===============navbar============= */}
                <nav>
                    <ul>
                        {navBarList.map((listOption, index) => {
                            return(
                                <span key={index}>
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

                        {/* ===============search-container============== */}
                        <div className={cx('search-container')}>
                            <div className={cx('search-bar')} id='search'>
                                <input 
                                    className={cx('search__input')} 
                                    type="text" 
                                    placeholder="type something..." 
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <FontAwesomeIcon className={cx('search__icon')} icon={icons.faMagnifyingGlass} />
                            </div>
    
                            <div className={cx('search-results')} id="search-results">
                                {apps.map(app => {
                                    return(
                                        <React.Fragment key={app.id}>
                                            {app.attributes.name.includes(query) && 
                                                <ListGroup variant="flush">
                                                    <Link to={'/app-details'} state={{app: app, apps: apps}}><ListGroup.Item>{app.attributes.name}</ListGroup.Item></Link>
                                                </ListGroup>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    </ul>
                    
                </nav>
            </div>
            {/* ================= left part of the header ============== */}
            <div className={cx('wrapper__right')}>
                {/* ==================user-container============= */}
                <div className={cx('user')}>
                    {/* ======================user, after logging in============= */}
                    {user ? (
                        <div className={cx('user__container')}>
                            <UserMenu isAdmin={user.isAdmin} data={userOptions}>
                                <div className={cx('user__container')}>
                                    <img src={user.photoURL} className={cx('avatar')}/>
                                    <span className={cx('username')}>{user.displayName}</span>
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
