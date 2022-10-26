import classnames from 'classnames/bind'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import style from './Categories.module.scss'
import React, { useEffect, useState } from 'react';

const cx = classnames.bind(style)

function Categories ({apps, categories, categoryId, category}) {
    let sortedApps = []

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
            <h4 className={cx('title')}>Danh sách các ứng dụng thuộc phân loại <span>{category.attributes.name}</span></h4>

            <div className={cx('apps-container')}>
                <Table striped bordered hover>
                    <thead className={cx('head')}>
                        <tr>
                            <th className={cx('head__index')}>#</th>
                            <th className={cx('head__image')}>Logo</th>
                            <th className={cx('head__name')}>name</th>
                            <th className={cx('head__download-link')}>Liên kết tải xuống</th>
                        </tr>
                    </thead>
                    <tbody className={cx('body')}>
                        {apps.map((app) => {
                            if(app.attributes.category.data.attributes.name === category.attributes.name) {
                                sortedApps.push(app)
                            }
                            if(category.attributes.name === "Tất cả") {
                                sortedApps.push(app)
                            }
                        })}

                        {sortedApps.map((sortedApp, index) => {
                            return (
                                <tr key={index}>
                                    <td className={cx('body__index')}>{index+1}</td>
                                    
                                    <td className={cx('body__image')}>
                                        <img 
                                            src={`http://localhost:1337${sortedApp.attributes.logo.data.attributes.url}`}
                                        />
                                    </td>

                                    <td className={cx('body__name')}>{sortedApp.attributes.name}</td>
                                    
                                    <td className={cx('body__download-link')}>
                                        {getMobileOperatingSystem() === 'Android' && (
                                            <a className={cx('head__download-link')} href={sortedApp.attributes.androidLink} target="blank"><img src='/pictures/android-download.png'/></a>
                                        )}
                                        {getMobileOperatingSystem() === 'IOS' && (
                                            <a className={cx('head__download-link')} href={sortedApp.attributes.iosLink} target="blank"><img src='/pictures/Apple-ios-download.png'/></a>
                                        )}
                                        {getMobileOperatingSystem() === 'WindowPhone' && (
                                            <span className={cx('message')}>Hiện tại ứng dụng này vẫn chưa có trên nền tảng Window phone</span>
                                        )}
                                        {getMobileOperatingSystem() != 'Android' && getMobileOperatingSystem() != 'IOS' && getMobileOperatingSystem() != 'WindowPhone' && (
                                            <span className={cx('message')}>Ứng dụng không khả dụng trên thiết bị của bạn</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}

                        {sortedApps.length === 0 && (
                            <tr>
                                <td colSpan={4}> 
                                    <div className={cx('message')}>Chưa có bất kì ứng dụng nào ở danh mục thể loại này!!!</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Categories
