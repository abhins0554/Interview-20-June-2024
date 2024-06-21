import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const items2 = [LaptopOutlined, UserOutlined, NotificationOutlined].map((icon, index) => {
    let name = '';
    if (icon === LaptopOutlined) name = "Home";
    else if (icon === UserOutlined) name = "Profile";
    else if (icon === NotificationOutlined) name = "Notifications";
    return {
        key: `${name}`,
        icon: React.createElement(icon),
        label: name,
    };
});

const App = ({ children }) => {
    const navigate = useNavigate();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ height: '100vh', width: '100%' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <img alt='logo' src='https://1000logos.net/wp-content/uploads/2021/10/logo-Meta.png' style={{ height: 50, width: 70 }} className="demo-logo" />
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}
                        onClick={(e) => navigate(`/${e.key.toLowerCase()}`)}
                        items={items2}
                    />
                </Sider>
                <Layout
                    style={{
                        padding: '0 24px 24px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
