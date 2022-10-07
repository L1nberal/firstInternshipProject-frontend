import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import React, { useState } from 'react';
import {Link} from "react-router-dom";
import classnames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    faDownload,
} from '../../../../../assets/FontAwesome'
import style from './Apps.module.scss'
import PaginationComponent from '../Pagination';

const cx = classnames.bind(style)

function Apps({data}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [appsPerPage, setAppsPerPage] = useState(4)
    
    // get current posts
    const indexOfLastApp = currentPage * appsPerPage
    const indexOfFirstApp = indexOfLastApp - appsPerPage
    const currentApps = data.slice(indexOfFirstApp, indexOfLastApp)

    // change page
    const paginate = (number) => {
        setCurrentPage(number)
    }
 
    return (
        <React.Fragment>
            <div className={cx('apps')}>
                <ListGroup>
                    {currentApps.map((app, index) => {        
                        return (
                            <Link to='/app-details' state={{app: app, apps: data}} key={index}>
                                <div className={cx('each-app')}>
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className={cx('app-infor-container')}>
                                            <div className={cx('app-name')}>{app.name}</div>
                                            <a href='#' target="blank"><div className={cx('app-owner')}>{app.Owner.data.attributes.name}</div></a>
                                        </div>
            
                                        <a href='google.com' target="blank" className={cx('download-link')}>
                                            <Badge bg="primary" pill className={cx('app-download')}>
                                                <FontAwesomeIcon icon={faDownload}/>
                                            </Badge>
                                        </a>
                                    </ListGroup.Item>
                                </div>
                            </Link>
                        )
                    })}
                </ListGroup>
            </div>

            <div className={cx('pagination-container')}>
                <PaginationComponent 
                    appsPerPage={appsPerPage} 
                    totalApps={data.length}
                    paginate={paginate}
                />
            </div>
        </React.Fragment>
    )
}

export default Apps
