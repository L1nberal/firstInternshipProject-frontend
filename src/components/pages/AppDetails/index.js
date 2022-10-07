import React, { useState, useEffect } from 'react'
import classnames from 'classnames/bind'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from './AppDetails.module.scss'
import axios from 'axios'
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    CarouselProvider,
    Slider,
    Slide,
    ButtonBack,
    ButtonNext
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import {
    faCloudArrowDown
} from '../../../assets/FontAwesome'
const cx = classnames.bind(style)

function AppDetails() {
    // check if there are any related apps
    let relatedApps = 0
    // get data from Link tag
    const location = useLocation();
    const data = location.state;

    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return 'WindowPhone'
        }
    
        if (/android/i.test(userAgent)) {
            return 'Android'

        }
    
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'IOS'
        }
    
        return "unknown";
    }

    console.log(getMobileOperatingSystem())
    
    return(
        <div className={cx('wrapper')}>
            {/* ==============details of each individual app============ */}
            <div className={cx('app-details')}>
                <div className={cx('head')}>
                    <img src={`http://localhost:1337${data.app.photo.data.attributes.url}`} alt={data.app.name}/>
                    <div className={cx('head__infor')}>
                        <div className={cx('name')}>{data.app.name}</div>
                        <div className={cx('organisation')}>Thuộc sở hữu của: <Link to="/organisation-details" state={data.app.Owner}>{data.app.Owner.data.attributes.name}</Link></div>
                        <div className={cx('category')}>Phân loại: <Link to="">{data.app.category.data.attributes.name}</Link></div>
                    </div>

                    <div className={cx('download-container')}>
                        {getMobileOperatingSystem() === 'Android' && (
                            <a className={cx('head__download-link')} href={data.app.androidLink} target="blank"><img src='/pictures/android-download.png'/></a>
                        )}
                        {getMobileOperatingSystem() === 'IOS' && (
                            <a className={cx('head__download-link')} href={data.app.iosLink} target="blank"><img src='/pictures/Apple-ios-download.png'/></a>
                        )}
                        {getMobileOperatingSystem() === 'WindowPhone' && (
                            <span className={cx('message')}>Hiện tại ứng dụng này vẫn chưa có trên nền tảng Window phone</span>
                            // <a className={cx('head__download-link')} href="#" target="blank"><FontAwesomeIcon icon={faCloudArrowDown}/></a>
                        )}
                        {getMobileOperatingSystem() != 'Android' && getMobileOperatingSystem() != 'IOS' && getMobileOperatingSystem() != 'WindowPhone' && (
                            <span className={cx('message')}>Ứng dụng không khả dụng trên thiết bị của bạn</span>
                        )}
                    </div>
                </div>

                <div className={cx('general-infor')}>
                    {data.app.description}
                </div>
                
                <div className={cx('carousel')}>
                    <h5 className={cx('carousel__title')}>Ảnh chụp màn hình:</h5>

                    <CarouselProvider
                        naturalSlideWidth={100}
                        naturalSlideHeight={125}
                        totalSlides={8}
                        visibleSlides={4}
                        currentSlide={1}
                    >
                        <Slider>
                           {data.app.screenshots.data.map((screenshot, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Slide className={cx('carousel-slide')}><img src={`http://localhost:1337${screenshot.attributes.url}`}/></Slide>
                                    </React.Fragment>
                                )
                           })}
                        </Slider>

                        <div className={cx('btn-container')}>
                            <ButtonBack className={cx('carousel-left-btn')}>Back</ButtonBack>
                            <ButtonNext className={cx('carousel-right-btn')}>Next</ButtonNext>
                        </div>
                    </CarouselProvider>
                </div>

                <div className={cx('developer')}>
                    <h5 className={cx('developer__title')}>Nhà phát triển: <Link to="/organisation-details" state={data.app.developer}>{data.app.developer.data.attributes.name}</Link></h5>
                    
                    <div className={cx('developer__contact')}>
                        <h5 className={cx('title')}>Thông tin liên hệ: </h5>

                        <div className={cx('infor')}>
                           <div className={cx('infor__phone-number')}>Số điện thoại: {data.app.developer.data.attributes.phoneNumber}</div>
                           <div className={cx('infor__email')}>Email: {data.app.developer.data.attributes.email}</div>
                           <div className={cx('infor__address')}>Địa chỉ: {data.app.developer.data.attributes.address}</div>
                           <div className={cx('infor__website')}>Website: <a href="www.huecit.vn" target="_blank">{data.app.developer.data.attributes.website}</a></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* =================apps which are related to the app shown ================== */}
            <div className={cx('related-apps')}>
                <h5 className={cx('related-apps__title')}>Các apps liên quan:</h5>

                {data.apps.map((app, index) => {
                    if(app.category.data.attributes.name === data.app.category.data.attributes.name && app.name != data.app.name) {
                        relatedApps = relatedApps + 1
                    }

                    return (
                        <React.Fragment key={index}>
                            {app.category.data.attributes.name === data.app.category.data.attributes.name && app.name != data.app.name && (
                               <Link to='/app-details' state={{app: app, apps: data.apps}}>
                                    <Card border="dark" className={cx('app-container')}>
                                        <Card.Body className='d-flex'>
                                            <Card.Img className={cx('image')} src={`http://localhost:1337${app.photo.data.attributes.url}`}></Card.Img>
                                            
                                            <Card.Text>
                                                <div className={cx('name')}>
                                                    {app.name}
                                                </div>
        
                                                <div className={cx('description')}>
                                                    {app.description}
                                                </div>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                               </Link>
                            )}
                        </React.Fragment>
                    )
                })}
                {/* ==============check if there's no app related to the app shown, a message would be printed out================ */}
                {relatedApps === 0 && <div className={cx('related-apps__message')}>Hiện tại thì {data.app.name} là ứng dụng duy nhất thuộc phân loại {data.app.category.data.attributes.name} tại trang web này!</div>}
            </div>
        </div>
    )
}

export default AppDetails
