import React from 'react';
import { useSelector } from "react-redux";
import { withRouter } from 'react-router-dom';

import { Menu } from 'antd';
import axios from 'axios';

import { USER_SERVER } from '../../../Config';

function RightMenu(props) {
    const user = useSelector(state => state.user);
    
    const logoutHandler = () => {
        axios.get(`${USER_SERVER}/logout`).then(response => {
            if (response.status === 200) {
                props.history.push("/login");
            } else {
                alert('로그아웃에 실패 했습니다.');
            }
        });
    };

    // 로그인 여부에 따라 NavBar이 달라짐
    if (user.userData && !user.userData.isAuth) {
        // 로그인하지 않은 유저
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="mail">
                    <a href="/login">Signin</a>
                </Menu.Item>
                <Menu.Item key="app">
                    <a href="/register">Signup</a>
                </Menu.Item>
            </Menu>
        );
    } else {
        // 로그인 한 유저
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="upload">
                    <a href="/video/upload">Video</a>
                </Menu.Item>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
        )
    }
    
    
}

export default withRouter(RightMenu);