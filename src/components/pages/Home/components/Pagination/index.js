import React, { useEffect, useState } from "react"
// import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import classnames from "classnames/bind";
import { Link } from "react-router-dom";

import style from './Pagination.module.scss'

const cx = classnames.bind(style)

function PaginationComponent({ appsPerPage, totalApps, paginate }) {
    // console.log(data)
    const pageNumbers = []

    for(let i = 1; i <= Math.ceil(totalApps / appsPerPage); i++) {
        pageNumbers.push(i)
    }
   
    return(  
        <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            {pageNumbers.map(number => {
                return (
                    <a 
                        key={number}
                        onClick={() => {
                            paginate(number)
                        }}
                    >
                        <Pagination.Item>{number}</Pagination.Item>
                    </a>
                )
            })}
            <Pagination.Next />
            <Pagination.Last />
        </Pagination>
    )
} 

export default PaginationComponent
  