import React from 'react';
import { Card, Radio, Typography, Progress, Button, Form, notification } from 'antd';
import { votePolls } from '../../../services/PollService';

const { Title, Text } = Typography;

const PollCard = ({ poll }) => {

    const [value, setValue] = React.useState(
        poll.options.find((option) => option.votedByUser)?._id || ''
    );

    const handleVote = (values) => {
        console.log('View submitted:', values);
    };


    const onChange = async (e) => {
        if (poll.answered) return notification.error({
            message: 'Question is required',
            description: 'Please enter a question',
        });
        let data = {
            poll_id: e.target.value,
            _id: poll._id
        }
        try {
            let { data: votePollData } = await votePolls(data, JSON.parse(localStorage.getItem('userData'))?.token);
            if (votePollData.code === 200) {
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

    return (
        <Card
            style={{
                width: "100%",
                backgroundColor: '#075E54',
                color: '#fff',
                borderRadius: 10,
                padding: '20px',
            }}
        >
            <Title level={4} style={{ color: '#fff' }}>
                {poll.question} ?
            </Title>
            <Text style={{ color: '#fff' }}>Select one or more</Text>
            <Form onFinish={handleVote}>
                <Form.Item name="vote">
                    <Radio.Group style={{ width: '100%' }} onChange={onChange} value={value} defaultValue={poll.options.find((option) => option.votedByUser)?._id || ''} disabled={poll.answered}>
                        {
                            poll.options.map((item, index) => {
                                return (
                                    <div key={item._id} style={{}}>
                                        <Radio
                                            value={item._id}
                                            key={item._id}
                                            style={{ color: '#fff' }}
                                        >
                                            {item.answer}
                                        </Radio>
                                        <Progress percent={item.votes / poll.answeredCount * 100} showInfo={false} strokeColor="#128C7E" />
                                    </div>
                                )
                            })
                        }
                    </Radio.Group>
                </Form.Item>
                <div style={{ textAlign: 'right', color: '#fff' }}>9:19 am</div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginTop: 10, backgroundColor: '#25D366', borderColor: '#25D366' }}>
                        View votes
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PollCard;
