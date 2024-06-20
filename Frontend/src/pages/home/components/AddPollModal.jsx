import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddPollModal = ({ show, handleClose, handleSave }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [optionCount, setOptionCount] = useState(2);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (optionCount < 5) {
            setOptionCount(optionCount + 1);
            setOptions([...options, '']);
        }
    };

    const handleSubmit = () => {
        const newPoll = {
            question,
            options: options.filter(option => option.trim() !== ''),
        };
        handleSave(newPoll);
        setQuestion('');
        setOptions(['', '']);
        setOptionCount(2);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Poll</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formQuestion">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter your question"
                        />
                    </Form.Group>
                    {Array.from({ length: optionCount }).map((_, index) => (
                        <Form.Group key={index} controlId={`formOption${index}`}>
                            <Form.Label>Option {index + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={options[index]}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                            />
                        </Form.Group>
                    ))}
                    {optionCount < 5 && (
                        <Button variant="link" onClick={addOption}>
                            + Add another option
                        </Button>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddPollModal;
