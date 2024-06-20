import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import AddPollModal from './AddPollModal';

const Poll = ({ polls, setPolls }) => {
    const [showModal, setShowModal] = useState(false);

    const handleSavePoll = (newPoll) => {
        setPolls([...polls, newPoll]);
    };

    const [selectedOptions, setSelectedOptions] = useState(polls.map(() => null));

    const handleOptionChange = (pollIndex, optionIndex) => {
        setSelectedOptions(prevState => {
            const newState = [...prevState];
            newState[pollIndex] = optionIndex;
            return newState;
        });
    };

    return (
        <div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Poll
            </Button>
            <AddPollModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleSavePoll}
            />
            {polls.map((poll, pollIndex) => (
                <Card key={pollIndex} className="mb-3">
                    <Card.Body>
                        <Card.Title>{poll.question}</Card.Title>
                        <Form>
                            {poll.options.map((option, optionIndex) => (
                                <Form.Check
                                    key={optionIndex}
                                    type="radio"
                                    label={option}
                                    name={`poll-${pollIndex}`}
                                    id={`poll-${pollIndex}-option-${optionIndex}`}
                                    checked={selectedOptions[pollIndex] === optionIndex}
                                    onChange={() => handleOptionChange(pollIndex, optionIndex)}
                                    disabled={selectedOptions[pollIndex] !== null && selectedOptions[pollIndex] !== optionIndex}
                                />
                            ))}
                        </Form>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default Poll;
