import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import Axios from 'axios';

import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const user = useSelector(state => state.user);
    const videoId = props.postId;
    const [CommentValue, setCommentValue] = useState("");

    // 댓글 입력칸 활성화
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    };

    // Submit 버튼 눌렀을 때
    const onSubmit = (event) => {
        event.preventDefault(); // 기본적으로 submit 버튼을 눌렀을 때 동작하는 action을 방지
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId
        }
        // 댓글 저장
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("");
                    props.refreshFunction(response.data.result);
                } else {
                    alert('댓글을 저장하지 못했습니다.');
                }
            });
    };

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && 
                    <React.Fragment> {/* React에서는 html이 아닌 jsx를 사용하므로 React.Fragment로 감싸줌 */}
                        <SingleComment postId={props.postId} comment={comment} refreshFunction={props.refreshFunction} />
                        <ReplyComment postId={props.postId} commentLists={props.commentLists} parentCommentId={comment._id} />
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder="댓글을 작성해 주세요."
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    );
}

export default Comment;