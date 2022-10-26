import classnames from 'classnames/bind'
import React from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

import style from './OwnedApps.module.scss'

const cx = classnames.bind(style)

function OwnedApps({apps, organisations, organisationId, organisation}) {
    let ownedApps = []
    
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
                                        if(app.attributes.Owner.data.attributes.name === organisation.attributes.name) {
                                            ownedApps.push(app)
                                        } 
                                    })}

                                    {ownedApps.map((ownedApp, index) => {
                                        return (
                                            <React.Fragment key={ownedApp.id}>
                                                <React.Fragment>
                                                    <tbody className={cx('each-app')}>
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td className={cx('image')}>
                                                                <Link to={`/app-details-${ownedApp.id}`}>
                                                                    <img 
                                                                        src={`http://localhost:1337${ownedApp.attributes.photo.data.attributes.url}`} 
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className={cx('name')} >
                                                                <span>{ownedApp.attributes.name}</span>
                                                            </td>
                                                            <td className={cx('category')}>
                                                                <span>{ownedApp.attributes.category.data.attributes.name}</span>
                                                            </td>
                                                            <td className={cx('download-link')}>
                                                                {getMobileOperatingSystem() === 'Android' && (
                                                                    <a className={cx('head__download-link')} href={ownedApp.attributes.androidLink} target="blank"><img src='/pictures/android-download.png'/></a>
                                                                )}
                                                                {getMobileOperatingSystem() === 'IOS' && (
                                                                    <a className={cx('head__download-link')} href={ownedApp.attributes.iosLink} target="blank"><img src='/pictures/Apple-ios-download.png'/></a>
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
                                            </React.Fragment>
                                        )
                                    })}
                                    {ownedApps.length === 0 && (
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

export default OwnedApps
