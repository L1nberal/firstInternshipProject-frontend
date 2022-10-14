import React, { useEffect, useState } from "react"
import classnames from 'classnames/bind'
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom'
import Badge from 'react-bootstrap/Badge';
import axios from 'axios'
import Moment from 'moment';
// import moment from 'moment';

import style from './Home.module.scss'
import Apps from './components/Apps'

const cx = classnames.bind(style)

function Home() {
    // store apps
    const [apps, setApps] = useState([])
    let store = []
    // store categories
    const [categories, setCategories] = useState([])
    let storeCategories = []
    // store organisations
    const [organisations, setOrganisations] = useState([])
    let storeOrganisations = []

    //get categories infor from API
    useEffect(() => {
        const getCategories = () => {
            axios('http://localhost:1337/api/categories?populate=*')
                .then(respond => setCategories(respond.data.data))
                .catch(error => console.log(error))
        }

        getCategories()
    }, [])

    useEffect(() => {
        fetch('http://localhost:1337/api/organisations?populate=*')
        .then(response => response.json())
        .then(data => {
            data.data.map((organisation) => {
                setOrganisations(() => {
                    storeOrganisations = [...storeOrganisations, organisation]
                    return storeOrganisations
                })               
            })  
        })
    }, [])

    //get apps infor from API
    useEffect(() => {
        fetch('http://localhost:1337/api/apps?populate=*')
        .then(response => response.json())
        .then(data => {
            data.data.map((app, index) => {
                setApps(() => {
                    store = [...store, app]
                    return store
                })               
            })  
        })
    }, [])
    // checked the first radio tag
    const [sortingIndex, setSortingIndex] = useState(0)
    setTimeout(() => {
        const firstRadio = document.getElementsByClassName('checked')
        firstRadio[sortingIndex].checked = true
    }, 10)
    
    useEffect(() => {
        setTimeout(() => {
            const firstRadio = document.getElementById(`check-${sortingIndex}`)
            firstRadio.checked = true
        }, 10)
    }, [sortingIndex])

    // ordering categories to prioritize some scrucial ones
    let categoriesTemporary
    for(let i = 0; i < categories.length-1; i++) {
        for(let j = i + 1; j < categories.length; j++) {
            if(categories[i].attributes.ordered > categories[j].attributes.ordered) {
                categoriesTemporary = categories[i]
                categories[i] = categories[j]
                categories[j] = categoriesTemporary
            }
        }
    }    
    
    
    // ordering apps based on the date where they are published
    let appsTemporary
    for(let i = 0; i < apps.length-1; i++) {
        for(let j = i + 1; j < apps.length; j++) {
            const formatDateI = Moment(apps[i].attributes.publishedAt).format("MM/DD/YYYY") 
            const formatDateJ = Moment(apps[j].attributes.publishedAt).format("MM/DD/YYYY") 
            const dateI = new Date(formatDateI)
            const now = new Date()
            const dateJ = new Date(formatDateJ)
            if(now.getTime()-dateI.getTime() > now.getTime()-dateJ.getTime()) {
                appsTemporary = apps[i]
                apps[i] = apps[j]
                apps[j] = appsTemporary
            }
        }
    }  
     
    // sorting apps
    const [sortingCategory, setSortingCategory] = useState('Tất cả')
    const checkHandler = (index) => {
        // console.log('123')
        const input = document.getElementById(`check-${index}`)
        setSortingCategory(input.nextElementSibling.innerHTML)
        setSortingIndex(index)
    }
    
    // console.log(sortingCategory)
    return(
        <div className={cx('content')}>
            {/* ===============apps container================s */}
            <div className={cx('apps-container')}>
                <h3 className={cx('title')}>Nổi bật</h3>
                {/* =========================app-list====================== */}
                <CardGroup>
                    {apps.map((app, index) => {
                        // distinguishing new and old apps
                        const formatDate = Moment(app.attributes.publishedAt).format("MM/DD/YYYY") 
                        const now = new Date()
                        const date = new Date(formatDate)
                        const amountOfDays1 = Math.ceil((now.getTime() -  date.getTime())/(1000*60*60*24))

                        return (
                            <React.Fragment key={index}>
                                {index < 4 && (
                                    <Card className={cx('app')}>
                                        <div className={cx('app-state')}>
                                            {amountOfDays1 < 25 ? (
                                                <Badge bg="primary" pill className={cx('app-state__new')}>
                                                    new
                                                </Badge>
                                            ) : (
                                                <Badge bg="primary" pill className={cx('app-state__old')}>
                                                    old
                                                </Badge>
                                            )}
                                        </div>
                                        <Card.Img className={cx('app-image')} variant="top" src={`http://localhost:1337${app.attributes.photo.data.attributes.url}`} alt={app.name}/>
                                        <Card.Body className={cx('app-body')}>
                                            <Card.Title className={cx('app-title')}>{app.attributes.name}</Card.Title>
                                            <div>
                                                <Card.Text className={cx('app-description')}>
                                                    {app.attributes.description}
                                                </Card.Text>
                                            </div>
                                        </Card.Body>
                                        {/* =================go to details button ================*/}
                                        <Link className={cx('app-details-button')} to={`/app-details-${app.id}`} state={{app: app}}>Chi tiết</Link>
                                    </Card>
                                )}
                            </React.Fragment>
                        )
                    })}
                </CardGroup>
            </div>
            {/* =================categories container=============== */}
            <div className={cx('categories-container')}>
                {/* ===================categories list=============== */}
                <div className={cx('categories')}>
                    <h3 className={cx('title')}>Thể loại</h3>

                    <Form>
                        <div className="mb-3">
                            {categories.map((category, index) => {
                                
                                return( 
                                    <Form.Check  
                                        key={index} 
                                        className={cx('each-category')} 
                                        id={`check-${category.attributes.ordered}`}
                                    >
                                        <Form.Check.Input
                                            type="radio" 
                                            className={cx('checked')} 
                                            name='category'
                                            onClick={() => {
                                                checkHandler(category.attributes.ordered)
                                            }}
                                        />
                                        <Form.Check.Label className={cx('check-lable')}>{category.attributes.name}</Form.Check.Label>
                                    </Form.Check>
                                )
                            })}
                        </div>
                    </Form>
                </div>
                {/* ======================pagination==================== */}
                <div className={cx('sorted-apps')}>
                    <Apps 
                        apps={apps} 
                        organisations={organisations} 
                        sortingCategory={sortingCategory}
                        sortingIndex={sortingIndex}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home
