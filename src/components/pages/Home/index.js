import React, { useEffect, useState } from "react"
import classnames from 'classnames/bind'
import Moment from 'moment';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'

import {
    faDownload,
} from '../../../assets/FontAwesome'
import style from './Home.module.scss'
import Button from "../../Button";
import Apps from './components/Apps'

const cx = classnames.bind(style)

function Home() {
    // store apps
    const [apps, setApps] = useState([])
    let store = []
    // store categories
    const [categories, setCategories] = useState([])
    let storeCategories = []
    // navigate  
    const navigate = useNavigate()

    //get categories infor from API
    useEffect(() => {
        fetch('http://localhost:1337/api/categories?populate=*')
        .then(response => response.json())
        .then(data => {
            data.data.map((post, index) => {
                setCategories(() => {
                    storeCategories = [...storeCategories, post.attributes]
                    return storeCategories
                })               
            })  
        })
    }, [])

    //get apps infor from API
    useEffect(() => {
        fetch('http://localhost:1337/api/apps?populate=*')
        .then(response => response.json())
        .then(data => {
            // console.log(data.data)
            data.data.map((app, index) => {
                setApps(() => {
                    store = [...store, app.attributes]
                    return store
                })               
            })  
        })
    }, [])
    // checked the first radio tag
    setTimeout(() => {
        const firstRadio = document.getElementsByClassName('checked')
        firstRadio[0].checked = true
    }, 500)

    return(
        <div className={cx('content')}>
            {/* ===============apps container================s */}
            <div className={cx('apps-container')}>
                <h3 className={cx('title')}>Nổi bật</h3>
                {/* =========================app-list====================== */}
                <CardGroup>
                    {apps.map((app, index) => {
                        const formatDate = Moment(app.publishedAt).format('DD-MM-YYYY') 
                        return (
                            <React.Fragment key={index}>
                                {index < 4 && (
                                    <Card className={cx('app')}>
                                        <Card.Img className={cx('app-image')} variant="top" src={`http://localhost:1337${app.photo.data.attributes.url}`} alt={app.name}/>
                                        <Card.Body className={cx('app-body')}>
                                            <Card.Title className={cx('app-title')}>{app.name}</Card.Title>
                                            <div>
                                                <Card.Text className={cx('app-description')}>
                                                    {app.description}
                                                </Card.Text>
                                                
                                                <Card.Text className={cx('app-publishing-date')}>
                                                    {formatDate}
                                                </Card.Text>
                                            </div>
                                        </Card.Body>
                                        {/* =================go to details button */}
                                        <Link className={cx('app-details-button')} to={'/app-details'} state={{app: app, apps: apps}}>Chi tiết</Link>
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
                                    <Form.Check key={index} className={cx('each-category')}>
                                        <Form.Check.Input type="radio" className={cx('checked')} name='category'/>
                                        <Form.Check.Label>{category.name}</Form.Check.Label>
                                    </Form.Check>
                                )
                            })}
                        </div>
                    </Form>
                </div>
                {/* ======================pagination==================== */}
                <div className={cx('sorted-apps')}>
                    <Apps data={apps}/>
                </div>
            </div>
        </div>
    )
}

export default Home
