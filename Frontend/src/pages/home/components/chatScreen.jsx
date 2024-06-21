import React from 'react';
import { Card, Avatar, Typography, Input, Button, notification } from 'antd';
import { PhoneOutlined, VideoCameraOutlined, MoreOutlined, SendOutlined, PaperClipOutlined, SmileOutlined } from '@ant-design/icons';
import { getChats } from '../../../services/ChatService';

import moment from 'moment';


const { Text } = Typography;

const ChatMessage = ({ text, time, isSender, createdBy }) => (
    <div style={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
        {!isSender && (
            <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }}>
                <span style={{ color: '#fff' }}>{createdBy.fullname.split('')[0]}</span>
            </Avatar>
        )}
        <Card
            style={{
                borderRadius: '20px',
                backgroundColor: isSender ? '#e6f7ff' : '#87d068',
                color: isSender ? '#000' : '#fff',
                maxWidth: '60%',
                textAlign: isSender ? 'right' : 'left',
            }}
        >
            {text}
        </Card>
        <div style={{ marginLeft: '10px', marginRight: '10px', alignSelf: 'flex-end' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>{time}</Text>
        </div>
    </div>
);

const ChatScreen = ({ socket }) => {

    let [chatData, setChatData] = React.useState([]);

    let [message, setMessage] = React.useState('');

    const chatContainerRef = React.useRef(null);

    let user_id = JSON.parse(localStorage.getItem('userData'))?._id;

    const fetchOldChats = async () => {
        try {
            let { data } = await getChats(JSON.parse(localStorage.getItem('userData')).token);
            if (data.code === 200) setChatData(data.data);
        } catch (error) {
            return notification.error({
                message: 'Some error occurred while saving',
                description: error?.message ?? error?.response?.data?.message ?? "Something went wrong",
            });
        }
    }

    React.useEffect(() => {
        fetchOldChats();
    }, []);

    const userTypingSocket = () => {
        document.getElementById("typingStatus").innerText = "typing...";
        setTimeout(() => {
            document.getElementById("typingStatus").innerText = "";
        }, 1500);
    }

    const sendMessage = () => {
        if (!message) return;
        socket.emit("chat message", {
            message,
            nick: JSON.parse(localStorage.getItem('userData')).name,
        });
        setMessage('');
    }

    const receivedMessage = (msg) => {
        setChatData((prevChatData) => [...prevChatData, msg]);
    }

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatData]);

    React.useEffect(() => {
        socket.on('typing', userTypingSocket);
        socket.on("chat message", receivedMessage);

        return () => {
            socket.off('typing', userTypingSocket);
            socket.off("chat message", receivedMessage);
        };
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: "80vh", width: '100%', margin: 'auto', border: '1px solid #d9d9d9', borderRadius: '10px', top: "-100px" }}>
            <div style={{ padding: '10px', display: 'flex', alignItems: 'center', backgroundColor: '#f0f2f5', borderBottom: '1px solid #d9d9d9' }}>
                <Avatar size="large" src="https://via.placeholder.com/150" />
                <div style={{ marginLeft: '10px' }}>
                    <Text strong>Group Chat</Text>
                    <div style={{ fontSize: '12px', color: '#52c41a' }} id="typingStatus"></div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <PhoneOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
                    <VideoCameraOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
                    <MoreOutlined style={{ fontSize: '20px' }} />
                </div>
            </div>
            <div style={{ flex: 1, padding: '10px', overflowY: 'scroll', backgroundColor: '#fff' }} ref={chatContainerRef}>
                {
                    chatData.map((item, index) => {
                        return <ChatMessage key={item._id} createdBy={item.createdBy} text={item.message} time={moment(item.time).format('MMMM Do YYYY, h:mm:ss a')} isSender={item.createdBy._id === user_id} />
                    })
                }
            </div>
            <div style={{ padding: '10px', display: 'flex', alignItems: 'center', borderTop: '1px solid #d9d9d9', backgroundColor: '#f0f2f5' }}>
                <SmileOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
                <PaperClipOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
                <Input
                    placeholder="Type your message..."
                    style={{ flex: 1, borderRadius: '20px' }}
                    value={message}
                    onChange={(e) => {
                        socket.emit('typing');
                        setMessage(e.target.value);
                    }}
                />
                <Button type="primary" shape="circle" icon={<SendOutlined />} style={{ marginLeft: '10px', backgroundColor: '#87d068', borderColor: '#87d068' }} onClick={sendMessage} />
            </div>
        </div>
    );
};

export default ChatScreen;
