import React, { useEffect, useState } from "react"
import classnames from 'classnames/bind'
import Moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import style from './Home.module.scss'
import { faAngleLeft, faAngleRight } from '../../../assets/FontAwesome'
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(style)

function Home() {
    const [apps, setApps] = useState([])
    let store = []

    //get infor from API
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

    //button onClick handler
    const track = document.getElementById('track')
    let i=0
   
    const turnRightHandler = () => {
        console.log(i)
        if(i>track.children.length-5) {
            i=track.children.length-5
        }
        for(i=i+1; i<track.children.length; i++) {
            track.style.transform = 'translateX(-' + 273*i + 'px)'
            break
        }
        console.log(i)

        hidingButtonHadler(i)
    }

    const turnLeftHandler = () => {
        if(i<1) {
            i=1
        }
        for(i=i-1; i>=0; i--) {
            track.style.transform = 'translateX(-' + 273*i + 'px)'
            break
        }
        hidingButtonHadler(i)
    }

    const hidingButtonHadler = (i) => {
        console.log(i)
        const leftButton = document.getElementById('app-turn-left-button')
        const rightButton = document.getElementById('app-turn-right-button')
        if(i>1) {
            rightButton.style.display = "none"
            leftButton.style.display = "block"
        }else if(i<1) {
            leftButton.style.display = "none"
            rightButton.style.display = "block"
        }else{
            rightButton.style.display = "block"
            leftButton.style.display = "block"
        }
    }

    return(
        <div className={cx('content')}>
            <section className={cx('apps-wrapper')}>
                <h3 className={cx('title')}>Apps nổi bật</h3>
                
                <button 
                    id="app-turn-left-button"
                    className={cx('app-turn-left-btn')}
                    onClick={turnLeftHandler}
                ><FontAwesomeIcon icon={faAngleLeft}/></button>

                <div className={cx('apps-list')}>
                    <ul id="track" className={cx('track')}>
                        {apps.map((app, index) => {
                            // console.log(app)
                            // const formatDate = Moment(app.publishedAt).format('DD-MM-YYYY')
                            return(
                                <div key={index} className={cx('app')} id="app">
                                    <img className={cx('app__image')} src={`http://localhost:1337${app.photos.data[0].attributes.url}`} alt={app.name}/>
                                    <div className={cx('app__name')}>{app.name}</div>
                                    <div className={cx('app__downloaded')}>Lượt tải: {app.downloaded}</div>
                                    <div className={cx('app__details')}>xem thêm</div>
                                </div>     
                            )
                        })}
                    </ul>
                </div>

                <button 
                    id="app-turn-right-button"
                    className={cx('app-turn-right-btn')} 
                    onClick={turnRightHandler}
                ><FontAwesomeIcon icon={faAngleRight}/></button>
            </section>
        </div>
    )
}

export default Home
