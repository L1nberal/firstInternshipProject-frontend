import React, { useState, useEffect } from "react"
import Toast from 'react-bootstrap/Toast';
import classnames from 'classnames/bind'
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import style from './Comments.module.scss'
import { AuthContext } from "../../../../../context/AuthContext";

const cx = classnames.bind(style)

function Comments({appId, users}) {
    // ===========navigating================================
    const navigate = useNavigate()
    // =========the person we reply to======================
    const [replyToWhom, setReplyToWhom] = useState('')
    // =========set reply comment to submit=============================
    const [replyComment, setReplyComment] = useState('')
    // =========set comment to submit=============================
    const [comment, setComment] = useState('')
    // =========set comment to update=============================
    const [commentUpdate, setCommentUpdate] = useState('')
    // =============comments to show========================
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

    //============get current user=======================
    const { user } = useContext(AuthContext)
    // ============submit comments=======================
    const submitHandler = () => {
        if(user === null){
            setShow(true)
        }

        axios.post("http://localhost:1337/api/comments",
        {
            data: {
                content: comment,
                parent_Id: 0,
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
    // ============show reply section handler===================
    const showReplyHandler = (repliedComment, commentId) => {
        const replySection = $(`#reply-section-${commentId}`)[0]
        users.map(user => {
            if(user.id === repliedComment.attributes.userId){
                setReplyToWhom(user.username) 
            }
        })

        if(replySection.style.display === "flex") {
            replySection.style.display = "none"
        }else {
            replySection.style.display = "flex"
        }

        for(let i = 0; i < $('div[name="reply-section"]').length; i++) {
            if($('div[name="reply-section"]')[i].id != replySection.id) {
                $('div[name="reply-section"]')[i].style.display = "none"
            }
        }
    }

    // ==============reply handler=======================
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

        for(let i = 0; i < $('div[name="reply-section"]').length; i++) {
            $('div[name="reply-section"]')[i].style.display = "none"
        }
    }

    // ============delete comment handler===========
    const deleteCommentHandler = async (commentId) => {
        await axios.delete(`http://localhost:1337/api/comments/${commentId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then(respond => {
                setCommentsToShow(commentsToShow.filter(commentFiltered => {
                    return commentFiltered.id != commentId
                }))
            })
            .catch(error => console.log(error))
        commentsToShow.map(comment => {
            if(comment.attributes.parent_Id === commentId) {
                axios.delete(`http://localhost:1337/api/comments/${comment.id}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                    }
                })
                    .then(respond => {
                        setCommentsToShow(commentsToShow.filter(commentFiltered => {
                            return commentFiltered.id != commentId
                        }))
                    })
                    .catch(error => console.log(error))
            }
        })
    }
    // ============== show comment update section==================
    const showUpdateSection = (commentId) => {
        if($(`#each-comment__update-section-${commentId}`)[0].style.display === "flex") {
            $(`#each-comment__update-section-${commentId}`)[0].style.display = "none"
        }else {
            $(`#each-comment__update-section-${commentId}`)[0].style.display = "flex"
        }
        
        for(let i = 0; i < $('div[name="each-comment__update-section"]').length; i++) {
            if($('div[name="each-comment__update-section"]')[i].id != $(`#each-comment__update-section-${commentId}`)[0].id) {
                $('div[name="each-comment__update-section"]')[i].style.display = "none"
            }
        }

        for(let i = 0; i < $('div[name="each-reply-comment__update-section"]').length; i++) {
            $('div[name="each-reply-comment__update-section"]')[i].style.display = "none"
        }
    }
    let array = []
    // ===========update comment hanlder===========
    const updateCommentHandler = (commentId) => {
        axios.put(`http://localhost:1337/api/comments/${commentId}`, {
            data:{
                content: commentUpdate
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then(respond => {
                commentsToShow.map(comment => {
                    if(comment.id === commentId) {
                        comment.attributes.content = commentUpdate
                    }

                    setCommentsToShow(() => {
                        array = [...array, comment]
                        return array
                    })
                })

                setCommentUpdate('')
            })

            if($(`#each-comment__update-section-${commentId}`)[0]) {
                $(`#each-comment__update-section-${commentId}`)[0].style.display = "none"
            }else {
                $(`#each-reply-comment__update-section-${commentId}`)[0].style.display = "none"
            }
    }

    //======== show Reply Comment Update Section============
    const showReplyCommentUpdateSection = (commentId) => {        
        if($(`#each-reply-comment__update-section-${commentId}`)[0].style.display === "flex") {
            $(`#each-reply-comment__update-section-${commentId}`)[0].style.display = "none"
        }else {
            $(`#each-reply-comment__update-section-${commentId}`)[0].style.display = "flex"
        }

        for(let i = 0; i < $('div[name="each-reply-comment__update-section"]').length; i++) {
            if($('div[name="each-reply-comment__update-section"]')[i].id != $(`#each-reply-comment__update-section-${commentId}`)[0].id) {
                $('div[name="each-reply-comment__update-section"]')[i].style.display = "none"
            }
        }

        for(let i = 0; i < $('div[name="each-comment__update-section"]').length; i++) {
            $('div[name="each-comment__update-section"]')[i].style.display = "none"
        }
    }
    //===============a dialogue pops up when errors occur==================
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return(
        <div className={cx('wrapper')}>
            {/* ========================popup dialogue====================== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bạn không thể bình luận</Modal.Title>
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
                                                    {users.map(user => {
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
                                            {/* ============comment update section=========== */}
                                            <div 
                                                className={cx('each-comment__update-section')}
                                                id={`each-comment__update-section-${comment.id}`}
                                                name="each-comment__update-section"
                                            >
                                                <textarea 
                                                    value={commentUpdate} 
                                                    type="text"
                                                    onChange={e => setCommentUpdate(e.target.value)}
                                                />
                                                <Button 
                                                    className={cx('update-btn')}
                                                    onClick={() => updateCommentHandler(comment.id)}
                                                >
                                                    Cập Nhật
                                                </Button>
                                            </div>

                                           <div className={cx('each-comment__btn')}>
                                                {user != null && (
                                                    <React.Fragment>
                                                        {/* =============delete comment feature============ */}
                                                        {(user.id === comment.attributes.userId || user.isAdmin === true) && 
                                                            <button 
                                                                onClick={() => deleteCommentHandler(comment.id)}
                                                                className={cx('each-comment__delete-btn')}
                                                            >
                                                                delete
                                                            </button>
                                                        }
            
                                                        {/* =============update comment feature============ */}
                                                        {user.id === comment.attributes.userId && 
                                                            <button 
                                                                onClick={() => showUpdateSection(comment.id)}
                                                                className={cx('each-comment__update-btn')}
                                                            >
                                                                update
                                                            </button>
                                                        }
            
                                                        {/* =========open reply comment submit section================= */}
                                                        <button 
                                                            onClick={() => showReplyHandler(comment, comment.id)}
                                                            className={cx('each-comment__reply-btn')}
                                                        >
                                                            reply
                                                        </button>
                                                    </React.Fragment>
                                                )}
                                           </div>
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

                                                        {/* ============reply comment update section=========== */}
                                                        <div 
                                                            className={cx('each-reply-comment__update-section')}
                                                            id={`each-reply-comment__update-section-${replyComment.id}`}
                                                            name="each-reply-comment__update-section"
                                                        >
                                                            <textarea 
                                                                value={commentUpdate} 
                                                                type="text"
                                                                onChange={e => setCommentUpdate(e.target.value)}
                                                            />
                                                            <Button 
                                                                className={cx('update-btn')}
                                                                onClick={() => updateCommentHandler(replyComment.id)}
                                                            >Cập Nhật</Button>
                                                        </div>

                                                        <div className={cx('each-reply-comment__btn')}>
                                                            {user != null && (
                                                                <React.Fragment>
                                                                    {/* =============delete feature============ */}
                                                                    {(user.id === replyComment.attributes.userId || user.isAdmin === true) && 
                                                                        <button 
                                                                            onClick={() => deleteCommentHandler(replyComment.id)}
                                                                            className={cx('each-reply-comment__delete-btn')}
                                                                        >
                                                                            delete
                                                                        </button>
                                                                    }
            
                                                                    {/* =============update comment feature============ */}
                                                                    {user.id === replyComment.attributes.userId && 
                                                                        <button 
                                                                            onClick={() => showReplyCommentUpdateSection(replyComment.id)}
                                                                            className={cx('each-reply-comment__update-btn')}
                                                                        >
                                                                            update
                                                                        </button>
                                                                    }
            
                                                                    {/* =========open reply comment submit section================= */}
                                                                    <button 
                                                                        onClick={() => showReplyHandler(replyComment, comment.id)}
                                                                        className={cx('each-reply-comment__reply-btn')}
                                                                    >
                                                                        reply
                                                                    </button>
                                                                </React.Fragment>
                                                            )}
                                                        </div>
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
                    {/* ==============this message is shown when no comment exists=========== */}
                    {commentsToShow.length === 0 && (
                        <div className={cx('message')}>Chưa có bình luận nào về ứng dụng này!</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comments
