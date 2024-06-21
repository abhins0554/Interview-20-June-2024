import React, { useState } from 'react';
import { Row, Col, notification, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/index';
import PollCard from './components/Pollcard';
import ChatScreen from './components/chatScreen';
import PollModal from './components/PollModal';
import { socket } from '../../services/socket';
import { getPolls, addPolls } from '../../services/PollService';

const Home = () => {
    const navigate = useNavigate();


    const connectSocket = () => {
        socket.connect();
    }

    React.useEffect(() => {
        connectSocket()
        if (!localStorage.getItem('userData')) return navigate('/login');
    }, []);

    const [isConnected, setIsConnected] = React.useState(socket.connected);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pollsData, setPollsData] = useState([]);
    const [api, contextHolder] = notification.useNotification();


    React.useEffect(() => {
        function onConnect() {
            let inter = setInterval(() => {
                try {
                    console.log("Trying to connect")
                    if (!isConnected) {
                        if (!socket.connected) socket.connect();
                        socket.emit('auth', JSON.stringify({ token: JSON.parse(localStorage.getItem('userData')).token }));
                        clearInterval(inter);
                    } else {
                        clearInterval(inter);
                    }
                } catch (error) {
                    clearInterval(inter);
                }
            }, 700);
            setIsConnected(true); // Set isConnected to true immediately
        }


        function onDisconnect() {
            setIsConnected(false);
            console.log('disconnect')
            onConnect();
        }

        function onFooEvent() {
            getPollsData();
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('poll_added', onFooEvent);

        onConnect();

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('poll_added', onFooEvent);
        };
    }, []);

    const getPollsData = async () => {
        try {
            const { data } = await getPolls(JSON.parse(localStorage.getItem('userData')).token);
            if (data.data.length) setPollsData(data.data);
            api.open({
                message: 'Data fetched successfully',
                description: 'Data fetched successfully',
                duration: 5000,
            });
        } catch (error) {
            api.open({
                message: 'Some error occurred',
                description: error?.message ?? error?.response?.data?.message ?? "Something went wrong",
                duration: 5000,
            });
        }
    };


    React.useEffect(() => {
        getPollsData();
    }, []);

    const handleAddPoll = () => {
        setIsModalVisible(true);
    };

    const handleSavePoll = async (poll) => {
        // Save the poll data to the server or state
        if (!poll.question) return notification.error({
            message: 'Question is required',
            description: 'Please enter a question',
        });
        let answers = poll?.answers.map(i => { return { answer: i } });
        if (!answers || answers?.length <= 1) return notification.error({
            message: 'Answer is required',
            description: 'Min 2 is required',
        });
        let data = {
            "question": poll.question,
            "options": answers
        }


        try {
            let { data: apiData } = await addPolls(data, JSON.parse(localStorage.getItem('userData')).token);
            if (apiData.code === 200) {
                setIsModalVisible(false);
                return notification.success({
                    message: 'Poll Added',
                    description: 'Your poll has been added successfully.',
                });
            }
        } catch (error) {
            return notification.error({
                message: 'Some error occurred while saving',
                description: error?.message ?? error?.response?.data?.message ?? "Something went wrong",
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };


    return (
        <Layout>
            {isConnected ? "Connected" : "Disconnected"}
            {contextHolder}
            <Row gutter={0} className="home-container" style={{ height: '84vh' }}>
                <Col span={12} className="leftside" style={{ overflowY: 'auto', padding: '10px', height: "80vh" }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" style={{ margin: 10 }} onClick={handleAddPoll}>
                            ADD POLL
                        </Button>
                    </div>
                    {pollsData.map((poll, index) => (
                        <PollCard key={poll._id} poll={poll} />
                    ))}
                </Col>
                <Col span={12} className="rightside" style={{ height: '100%' }}>
                    <ChatScreen socket={socket} />
                </Col>
            </Row>
            <PollModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSave={handleSavePoll}
            />
        </Layout>
    );
};

export default Home;
