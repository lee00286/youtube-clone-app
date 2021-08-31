import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';

const { TextArea } = Input;

// 첫 번째 depth
function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    // const actions에 사용됨
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    }

    // 댓글 입력칸 활성화
    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    // Submit 버튼 눌렀을 때
    const onSubmit = (event) => {
        event.preventDefault(); // 기본적으로 submit 버튼을 눌렀을 때 동작하는 action을 방지

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        };
        // 댓글 저장
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("");
                    setOpenReply(!OpenReply);
                    props.refreshFunction(response.data.result); // 댓글 리스트에 새 댓글 추가
                } else {
                    alert('댓글을 저장하지 못했습니다.');
                }
            });
    }

    // SingleComment에 답글하는 공간 여는 버튼
    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="image" />}
                content={ <p>{props.comment.content}</p> }
            />

            {/* SingleComment에 답글하기 */}
            {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: '80%', borderRadius: '5px', marginLeft: '40px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="댓글을 작성해 주세요."
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>
            }
        </div>
    );
}

export default SingleComment;
