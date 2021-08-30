import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Input } from 'antd';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    // const actions에 사용됨
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    }

    // 코멘트 입력칸 활성화
    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.CommentValue);
    }

    // Submit 버튼 눌렀을 때
    const onSubmit = (event) => {
        event.preventDefault(); // 기본적으로 submit 버튼을 눌렀을 때 동작하는 action을 방지함

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        };

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
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={ <p>{props.comment.content}</p> }
            />

            {/* Single Comment에 Reply하기 */}
            {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요."
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            }
        </div>
    );
}

export default SingleComment;
