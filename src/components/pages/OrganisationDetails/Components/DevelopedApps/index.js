import classnames from 'classnames/bind'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import style from './DevelopedApps.module.scss'
import React, { useEffect, useState } from 'react';

const cx = classnames.bind(style)

function DevelopedApps ({apps, organisations, organisationId, organisation}) {
    let developedApps = []
    
    // detecting the device's OS
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

    return (
        <div className={cx('wrapper')}>
            <h4 className={cx('title')}>Danh sách các ứng dụng được sở hữu bởi <Link to={`/organisation-details-${organisationId}`}>{organisation.attributes.name}</Link></h4>

            <div className={cx('apps-container')}>
                <Table striped bordered hover>
                    <thead className={cx('head')}>
                        <tr>
                            <th className={cx('head__index')}>#</th>
                            <th className={cx('head__image')}>Logo</th>
                            <th className={cx('head__name')}>name</th>
                            <th className={cx('head__category')}>Phân loại</th>
                            <th className={cx('head__download-link')}>Liên kết tải xuống</th>
                        </tr>
                    </thead>

                    {organisations.map(organisation => {
                        if(organisation.id === organisationId) {
                            return (
                                <React.Fragment key={organisation.id}>
                                    {apps.map((app, index) => {
                                        if(app.attributes.developer.data.attributes.name === organisation.attributes.name) {
                                            developedApps.push(app)
                                        }
                                    })}

                                    {developedApps.map((developedApp, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <tbody className={cx('each-app')}>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td className={cx('image')}>
                                                            <Link to={`/app-details-${developedApp.id}`}>
                                                                <img 
                                                                    src={`http://localhost:1337${developedApp.attributes.photo.data.attributes.url}`} 
                                                                />
                                                            </Link>
                                                        </td>
                                                        <td className={cx('name')} >
                                                            <span>{developedApp.attributes.name}</span>
                                                        </td>
                                                        <td className={cx('category')}>
                                                            <span>{developedApp.attributes.category.data.attributes.name}</span>
                                                        </td>
                                                        <td className={cx('download-link')}>
                                                            {getMobileOperatingSystem() === 'Android' && (
                                                                <a className={cx('head__download-link')} href={developedApp.attributes.androidLink} target="blank"><img src='/pictures/android-download.png'/></a>
                                                            )}
                                                            {getMobileOperatingSystem() === 'IOS' && (
                                                                <a className={cx('head__download-link')} href={developedApp.attributes.iosLink} target="blank"><img src='/pictures/Apple-ios-download.png'/></a>
                                                            )}
                                                            {getMobileOperatingSystem() === 'WindowPhone' && (
                                                                <span className={cx('message')}>Hiện tại ứng dụng này vẫn chưa có trên nền tảng Window phone</span>
                                                            )}
                                                            {getMobileOperatingSystem() != 'Android' && getMobileOperatingSystem() != 'IOS' && getMobileOperatingSystem() != 'WindowPhone' && (
                                                                <span className={cx('message')}>Ứng dụng không khả dụng trên thiết bị của bạn</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </React.Fragment>
                                        )
                                    })}
                                    {developedApps.length === 0 && (
                                        <td colSpan={5}>
                                            <div className={cx('message')}>
                                                <span>{organisation.attributes.name}</span>
                                                Vẫn chưa sở hữu bất kì ứng dụng nào!!
                                            </div>
                                        </td>
                                    )}
                                </React.Fragment>
                            )
                        }
                    })}
                </Table>
            </div>
        </div>
    )
}

export default DevelopedApps
