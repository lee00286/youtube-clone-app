import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

import SingleComment from './SingleComment';

const { TextArea } = Input;

function ReplyComment(props) {
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        // 답글 수 계산
        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        });
        // 답글 수 바꾸기
        setChildCommentNumber(commentNumber);
    }, [props.commentLists, props.parentCommentId]); // []에 무언가를 넣을 경우 useEffect가 새로 실행됨

    // 모든 댓글 불러오기
    let renderReplyComment = (parentCommentId) => {
        props.commentLists.map((comment, index) => {
            {/* 답글이 있어야 아래의 코드가 작동 */}
            {comment.responseTo === parentCommentId && 
                <div style={{ width: '80%', marginLeft: '40px' }}>
                    <React.Fragment> {/* React에서는 html이 아닌 jsx를 사용하므로 React.Fragment로 감싸줌 */}
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment postId={props.postId} commentLists={props.commentLists} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                </div>
            }
        });
    };

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments);
    };

    return (
        <div>
            {/* 답글이 존재할 경우에만 작동 */}
            {ChildCommentNumber > 0 && 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
        </div>
    );
}

export default ReplyComment;
