import React, { useEffect, useState, useRef } from "react"
import classnames from 'classnames/bind'
// import Moment from 'moment';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import style from './Home.module.scss'

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
    // settings for the carousel
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
            }
            },
            {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            }
        ]
    };
 
    return(
        <div className={cx('content')}>
            {/* ===========app-carousel-container============== */}
           <div className={cx('apps-carousel')}>
                {/* ==============title========== */}
                <h3 className={cx('title')}>APPs</h3>
                {/* =========carousel=========== */}
                <Slider {...settings} className={cx('track')}>
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
                </Slider>
           </div>
            
        </div>
    )
}

export default Home
