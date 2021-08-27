import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { AlignRightOutlined } from '@ant-design/icons';
import './Sections/Navbar.css';

import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';

function NavBar() {
    const [Visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    return (
        <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
            <div className="menu__logo">
                <a href="/">Logo</a>
            </div>
            <div className="menu__container">
                {/* Left Menu */}
                <div className="menu_left">
                    <LeftMenu mode="horizontal" />
                </div>
                {/* Right Menu */}
                <div className="menu_right">
                    <RightMenu mode="horizontal" />
                </div>

                {/* Side NavBar 여는 버튼 */}
                <Button
                    className="menu__mobile-button"
                    type="primary"
                    onClick={showDrawer}
                >
                    <AlignRightOutlined />
                </Button>

                {/* Side NavBar */}
                <Drawer
                    title="Basic Drawer"
                    placement="right"
                    className="menu_drawer"
                    closable={false}
                    onClose={onClose}
                    visible={Visible}
                >
                    <LeftMenu mode="inline" />
                    <RightMenu mode="inline" />
                </Drawer>
            </div>
        </nav>
    )
}

export default NavBar;
