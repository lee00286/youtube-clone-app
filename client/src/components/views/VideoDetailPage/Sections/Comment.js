import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';

import SingleComment from './SingleComment';

function Comment(props) {
    const user = useSelector(state => state.user);
    const videoId = props.postId;
    const [CommentValue, setCommentValue] = useState("");

    // 코멘트 입력칸 활성화
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    };

    // Submit 버튼 눌렀을 때
    const onSubmit = (event) => {
        event.preventDefault(); // 기본적으로 submit 버튼을 눌렀을 때 동작하는 action을 방지함
        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId
        }
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setCommentValue("");
                    props.refreshFunction(response.data.result);
                } else {
                    alert('커멘트를 저장하지 못했습니다.');
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
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder="코멘트를 작성해 주세요."
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    );
}

export default Comment;