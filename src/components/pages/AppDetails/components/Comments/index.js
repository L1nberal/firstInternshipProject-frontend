import React, { useState, useEffect } from "react"
import Toast from 'react-bootstrap/Toast';
import Moment from 'moment';
import classnames from 'classnames/bind'
import moment from 'moment';
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import style from './Comments.module.scss'
import { AuthContext } from "../../../../../context/AuthContext";

const cx = classnames.bind(style)

function Comments({app, appId, users}) {
    // ===========navigating=============
    const navigate = useNavigate()
    // =========the person we reply to============
    const [replyToWhom, setReplyToWhom] = useState('')
    // =========getting comment============
    const [replyComment, setReplyComment] = useState('')
    // =========getting comment============
    const [comment, setComment] = useState('')
    // =============comments to show===========
    const [commentsToShow, setCommentsToShow] = useState([])
    let arrayOfComments = []
    useEffect(() => { //get comments from api
        axios.get("http://localhost:1337/api/comments?populate=*")
            .then(respond => {
                respond.data.data.map(comment => {
                    if(comment.attributes.app.data.id === appId) {
                        setCommentsToShow(() => {
                            arrayOfComments = [...arrayOfComments, comment]
                            return arrayOfComments
                        })
                    }

                })
            })
            .catch(error => console.log(error))
    
        return setCommentsToShow([])
    }, [appId])  
    // console.log(comment)
    // console.log(replyComment)

    let temporaryComment
    for(let i = 0; i < commentsToShow.length-1; i++) {
        for(let j = i + 1; j < commentsToShow.length; j++) {
            const dateI = new Date(commentsToShow[i].attributes.publishedAt)
            const now = new Date()
            const dateJ = new Date(commentsToShow[j].attributes.publishedAt)
            if(now.getTime()-dateI.getTime() > now.getTime()-dateJ.getTime()) {
                temporaryComment = commentsToShow[i]
                commentsToShow[i] = commentsToShow[j]
                commentsToShow[j] = temporaryComment
            }
        }
    }   
    //============get current user============== 
    const { user } = useContext(AuthContext)
    // ============submit comments============
    const submitHandler = () => {
        axios.post("http://localhost:1337/api/comments",
        {
            data: {
                content: comment,
                parentId: 0,
                app: appId,
                userId: user.id,
                replyTo: "no one"
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then(respond => {
                setCommentsToShow([respond.data.data, ...commentsToShow])
            })
            .catch(error => console.log(error))
        setComment('')
    }
    // ============show reply section handler==========
    const showReplyHandler = (repliedComment, commentId) => {
        const replySection = $(`#reply-section-${commentId}`)[0]
        users.map(user => {
            if(user.id === repliedComment.attributes.userId){
                setReplyToWhom(user.username) 
            }
        })
        replySection.style.display = "flex"

        for(let i = 0; i < $('div[name="reply-section"]').length; i++) {
            if($('div[name="reply-section"]')[i].id != replySection.id) {
                $('div[name="reply-section"]')[i].style.display = "none"
            }
        }
    }

    // ==============reply handler==============
    const replyHandler = (commentId, username) => {
        if(user === null){
            setShow(true)
        }

        axios.post("http://localhost:1337/api/comments", {
            data: {
                content: replyComment,
                parent_Id: commentId,
                app: appId,
                userId: user.id,
                replyTo: replyToWhom
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then(respond => {
                setCommentsToShow([respond.data.data, ...commentsToShow])
            })
            .catch(error => console.log(error))
        
        setReplyComment('')
    }
    
    //a dialogue pops up when errors occur
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return(
        <div className={cx('wrapper')}>
            {/* =============popup dialogue============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn cần đăng nhập để bình luận!</Modal.Body>
                <Modal.Footer>
                    <Button 
                        onClick={handleClose}
                        className={cx('modal-btn')}
                        variant="secondary"
                    >
                        Đã hiểu
                    </Button>

                    <Button 
                        onClick={() => {
                            handleClose()
                            navigate('/log-in')
                        }}
                        className={cx('modal-btn')}
                        variant="warning"
                    >
                        Đăng nhập!
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className={cx('comment')}>
                <textarea 
                    value={comment}
                    id="comment" 
                    name="comment" 
                    className={cx('textarea')}
                    placeholder="Type something...."
                    onChange={(e) => setComment(e.target.value)}
                >
                </textarea>
                <button  
                    className={cx('submit-btn')}
                    onClick={() => {
                        submitHandler()
                    }}                
                >
                    Bình luận
                </button>
                
                {/* ======================show all comments========================== */}
                <div className={cx('comments-shown')}>
                    {commentsToShow.map((comment, index) => {
                        // ==========================show each comments========================
                        if(comment.attributes.parent_Id === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <div className={cx('comments')}>
                                        <Toast className={cx('each-comment')}>
                                            <Toast.Header 
                                                closeButton={false} 
                                                className={cx('each-comment__header')}
                                            >
                                                <small className={cx('commentator')}>
                                                    {users.map(user  => {
                                                        if(user.id === comment.attributes.userId) {
                                                            return (
                                                                <React.Fragment key={user.id}>{user.username}</React.Fragment>
                                                            )
                                                        }
                                                    })}
                                                </small>
        
                                                <small className={cx('published-at')}>
                                                    {comment.attributes.publishedAt}
                                                </small>
                                            </Toast.Header>
                                            <Toast.Body 
                                                className={cx('each-comment__content')}
                                            >
                                                {comment.attributes.content}
                                            </Toast.Body>
                                            {/* =========open reply comment submit section================= */}
                                            <button 
                                                onClick={() => showReplyHandler(comment, comment.id)}
                                                className={cx('each-comment__reply-btn')}
                                            >
                                                reply
                                            </button>
                                        </Toast>
                                    </div>
                                {/* =====================all reply comments ==================== */}
                                    <div
                                        className={cx('reply-comments')}
                                    >
                                        {commentsToShow.map(replyComment => {
                                            if(replyComment.attributes.parent_Id === comment.id) {
                                                return (
                                                    <Toast className={cx('each-reply-comment')} key={replyComment.id}>
                                                        <Toast.Header 
                                                            closeButton={false} 
                                                            className={cx('each-reply-comment__header')}
                                                        >
                                                            <small className={cx('commentator')}>
                                                                {users.map(user  => {
                                                                    if(user.id === replyComment.attributes.userId) {
                                                                        return (
                                                                            <React.Fragment key={user.id}>{user.username}</React.Fragment>
                                                                        )
                                                                    }
                                                                })}
                                                            </small>

                                                            <div className={cx('infor')}>
                                                                <small className={cx('reply-to')}>
                                                                    reply to: {replyComment.attributes.replyTo}
                                                                </small>
    
                                                                <small className={cx('published-at')}>
                                                                    {replyComment.attributes.publishedAt}
                                                                </small>
                                                            </div>
                                                        </Toast.Header>
                                                        <Toast.Body 
                                                            className={cx('each-reply-comment__content')}
                                                        >
                                                            {replyComment.attributes.content}
                                                        </Toast.Body>
                                                        {/* =========open reply comment submit section================= */}
                                                        <button 
                                                            onClick={() => showReplyHandler(replyComment, comment.id)}
                                                            className={cx('each-reply-comment__reply-btn')}
                                                        >
                                                            reply
                                                        </button>
                                                    </Toast>
                                                )
                                            }
                                        })}
                                    </div> 
                                    {/* ====================== reply comment submit section ====================*/}
                                    <div 
                                        className={cx('reply-section')}
                                        id={`reply-section-${comment.id}`}
                                        name="reply-section"
                                    >
                                        {users.map(user  => {
                                            if(user.id === comment.attributes.userId) {
                                                return (
                                                    <React.Fragment key={user.id}>
                                                        <div className={cx('reply-section__input-container')}>
                                                            <span className={cx('reply-to')}>Reply to: {replyToWhom} </span>
                                                            <input 
                                                                value={replyComment}
                                                                onChange={(e) => setReplyComment(e.target.value)}
                                                                type="text"
                                                                className={cx('input')}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => replyHandler(comment.id, user.username)}
                                                            className={cx('reply-section__btn')}
                                                        >
                                                            Bình luận
                                                        </button>
                                                    </React.Fragment>
                                                )
                                            }
                                        })}
                                    </div> 
                                </React.Fragment>
                            )
                        }
                       })
                    }
                         
                    {commentsToShow.length === 0 && (
                        <div className={cx('message')}>Chưa có bình luận nào về ứng dụng này!</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comments
