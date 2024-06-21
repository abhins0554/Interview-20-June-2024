import React, { useState } from 'react';
import { Modal, Form, Input, Button, } from 'antd';

const PollModal = ({ isVisible, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [answers, setAnswers] = useState(['', '']);

    const addAnswerField = () => {
        setAnswers([...answers, '']);
    };

    const handleSave = () => {
        try {
            form.validateFields().then(values => {
                onSave({ ...values, answers });
                form.resetFields();
                setAnswers(['', '']);
            });
        } catch (error) {

        }
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    return (
        <Modal
            title="Add New Poll"
            visible={isVisible}
            onCancel={onClose}
            onOk={handleSave}
            okText="Save"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Question"
                    name="question"
                    rules={[{ required: true, message: 'Please input the question!' }]}
                >
                    <Input placeholder="Enter your question" />
                </Form.Item>
                {answers.map((answer, index) => (
                    <Form.Item
                        key={index}
                        label={`Answer ${index + 1}`}
                        rules={[{ required: true, message: 'Please input the answer!' }]}
                    >
                        <Input
                            value={answer}
                            onChange={e => handleAnswerChange(index, e.target.value)}
                            placeholder="Enter an answer"
                        />
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={addAnswerField}>
                        Add More Answers
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PollModal;
