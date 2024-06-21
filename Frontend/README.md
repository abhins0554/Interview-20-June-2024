# Chat/Poll Application Frontend

This README provides an overview and instructions for the frontend code of a chat application. The code is implemented using React and Ant Design. It includes functionalities such as user authentication, real-time chat, and auto-scrolling to the latest message.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Dependencies](#dependencies)
4. [Code Explanation](#code-explanation)
   - [Home Component](#home-component)
   - [Chat Component](#chat-component)
   - [Socket Service](#socket-service)
   - [Poll Service](#poll-service)
   - [Poll Modal](#poll-modal)
   - [Poll Card](#poll-card)
   - [Chat Screen](#chat-screen)
5. [Running the Application](#running-the-application)

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

## Project Structure

```plaintext
src/
├── components/
│   ├── layout/
│       └── index.js
├── services/
│   ├── client.js
│   ├── AuthService.js
│   ├── ChatService.js
│   ├── PollService.js
│   ├── Socket.js
├── pages/
│   ├── login.js
│       └── login.jsx
│       └── login.css
│   ├── signup
│       └── signup.jsx
│       └── signup.css
│   └── home
│       └── home.jsx
│       └── components/
│           ├── chatScreen.js
│           ├── pollCard.js
│           ├── pollModal.js
├── routes/
│   ├── routes.js
├── index.js
```

## Dependencies

- React
- React Router DOM
- Ant Design
- Socket.IO Client
- Axios
- Moment.js

## Code Explanation

### Home Component

The `Home` component is the main entry point for the application. It manages the connection to the WebSocket server and handles user authentication and polling functionality.

```javascript
import React, { useState } from "react";
import { Row, Col, notification, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/index";
import PollCard from "./components/Pollcard";
import ChatScreen from "./components/chatScreen";
import PollModal from "./components/PollModal";
import { socket } from "../../services/socket";
import { getPolls, addPolls } from "../../services/PollService";

const Home = () => {
  const navigate = useNavigate();

  const connectSocket = () => {
    socket.connect();
  };

  React.useEffect(() => {
    connectSocket();
    if (!localStorage.getItem("userData")) return navigate("/login");
  }, []);

  const [isConnected, setIsConnected] = React.useState(socket.connected);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pollsData, setPollsData] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  React.useEffect(() => {
    function onConnect() {
      let inter = setInterval(() => {
        try {
          console.log("Trying to connect");
          if (!isConnected) {
            if (!socket.connected) socket.connect();
            socket.emit(
              "auth",
              JSON.stringify({
                token: JSON.parse(localStorage.getItem("userData")).token,
              })
            );
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
      console.log("disconnect");
      onConnect();
    }

    function onFooEvent() {
      getPollsData();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("poll_added", onFooEvent);

    onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("poll_added", onFooEvent);
    };
  }, []);

  const getPollsData = async () => {
    try {
      const { data } = await getPolls(
        JSON.parse(localStorage.getItem("userData")).token
      );
      if (data.data.length) setPollsData(data.data);
      api.open({
        message: "Data fetched successfully",
        description: "Data fetched successfully",
        duration: 5000,
      });
    } catch (error) {
      api.open({
        message: "Some error occurred",
        description:
          error?.message ??
          error?.response?.data?.message ??
          "Something went wrong",
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
    if (!poll.question)
      return notification.error({
        message: "Question is required",
        description: "Please enter a question",
      });
    let answers = poll?.answers.map((i) => {
      return { answer: i };
    });
    if (!answers || answers?.length <= 1)
      return notification.error({
        message: "Answer is required",
        description: "Min 2 is required",
      });
    let data = {
      question: poll.question,
      options: answers,
    };

    try {
      let { data: apiData } = await addPolls(
        data,
        JSON.parse(localStorage.getItem("userData")).token
      );
      if (apiData.code === 200) {
        setIsModalVisible(false);
        return notification.success({
          message: "Poll Added",
          description: "Your poll has been added successfully.",
        });
      }
    } catch (error) {
      return notification.error({
        message: "Some error occurred while saving",
        description:
          error?.message ??
          error?.response?.data?.message ??
          "Something went wrong",
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
      <Row gutter={0} className="home-container" style={{ height: "84vh" }}>
        <Col
          span={12}
          className="leftside"
          style={{ overflowY: "auto", padding: "10px", height: "80vh" }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              style={{ margin: 10 }}
              onClick={handleAddPoll}
            >
              ADD POLL
            </Button>
          </div>
          {pollsData.map((poll, index) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </Col>
        <Col span={12} className="rightside" style={{ height: "100%" }}>
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
```

### Chat Component

The `ChatComponent` handles rendering the chat messages and auto-scrolling to the latest message.

```javascript
import React from "react";
import { Card, Avatar, Typography, Input, Button, notification } from "antd";
import {
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { getChats } from "../../../services/ChatService";

import moment from "moment";

const { Text } = Typography;

const ChatMessage = ({ text, time, isSender, createdBy }) => (
  <div
    style={{
      display: "flex",
      justifyContent: isSender ? "flex-end" : "flex-start",
      marginBottom: "10px",
    }}
  >
    {!isSender && (
      <Avatar style={{ backgroundColor: "#87d068", marginRight: "10px" }}>
        <span style={{ color: "#fff" }}>{createdBy.fullname.split("")[0]}</span>
      </Avatar>
    )}
    <Card
      style={{
        borderRadius: "20px",
        backgroundColor: isSender ? "#e6f7ff" : "#87d068",
        color: isSender ? "#000" : "#fff",
        maxWidth: "60%",
        textAlign: isSender ? "right" : "left",
      }}
    >
      {text}
    </Card>
    <div
      style={{ marginLeft: "10px", marginRight: "10px", alignSelf: "flex-end" }}
    >
      <Text type="secondary" style={{ fontSize: "12px" }}>
        {time}
      </Text>
    </div>
  </div>
);

const ChatScreen = ({ socket }) => {
  let [chatData, setChatData] = React.useState([]);

  let [message, setMessage] = React.useState("");

  const chatContainerRef = React.useRef(null);

  let user_id = JSON.parse(localStorage.getItem("userData"))?._id;

  const fetchOldChats = async () => {
    try {
      let { data } = await getChats(
        JSON.parse(localStorage.getItem("userData")).token
      );
      if (data.code === 200) setChatData(data.data);
    } catch (error) {
      return notification.error({
        message: "Some error occurred while saving",
        description:
          error?.message ??
          error?.response?.data?.message ??
          "Something went wrong",
      });
    }
  };

  React.useEffect(() => {
    fetchOldChats();
  }, []);

  const userTypingSocket = () => {
    document.getElementById("typingStatus").innerText = "typing...";
    setTimeout(() => {
      document.getElementById("typingStatus").innerText = "";
    }, 1500);
  };

  const sendMessage = () => {
    if (!message) return;
    socket.emit("chat message", {
      message,
      nick: JSON.parse(localStorage.getItem("userData")).name,
    });
    setMessage("");
  };

  const receivedMessage = (msg) => {
    setChatData((prevChatData) => [...prevChatData, msg]);
  };

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);

  React.useEffect(() => {
    socket.on("typing", userTypingSocket);
    socket.on("chat message", receivedMessage);

    return () => {
      socket.off("typing", userTypingSocket);
      socket.off("chat message", receivedMessage);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        width: "100%",
        margin: "auto",
        border: "1px solid #d9d9d9",
        borderRadius: "10px",
        top: "-100px",
      }}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Avatar size="large" src="https://via.placeholder.com/150" />
        <div style={{ marginLeft: "10px" }}>
          <Text strong>Group Chat</Text>
          <div
            style={{ fontSize: "12px", color: "#52c41a" }}
            id="typingStatus"
          ></div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <PhoneOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
          <VideoCameraOutlined
            style={{ fontSize: "20px", marginRight: "10px" }}
          />
          <MoreOutlined style={{ fontSize: "20px" }} />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "scroll",
          backgroundColor: "#fff",
        }}
        ref={chatContainerRef}
      >
        {chatData.map((item, index) => {
          return (
            <ChatMessage
              key={item._id}
              createdBy={item.createdBy}
              text={item.message}
              time={moment(item.time).format("MMMM Do YYYY, h:mm:ss a")}
              isSender={item.createdBy._id === user_id}
            />
          );
        })}
      </div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #d9d9d9",
          backgroundColor: "#f0f2f5",
        }}
      >
        <SmileOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
        <PaperClipOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
        <Input
          placeholder="Type your message..."
          style={{ flex: 1, borderRadius: "20px" }}
          value={message}
          onChange={(e) => {
            socket.emit("typing");
            setMessage(e.target.value);
          }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          style={{
            marginLeft: "10px",
            backgroundColor: "#87d068",
            borderColor: "#87d068",
          }}
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatScreen;
```

### Socket Service

The `socket.js` file handles the initialization and configuration of the WebSocket connection using Socket.IO client.

```javascript
import { io } from "socket.io-client";

export const socket = io("http://localhost:5001");
```

### Poll Service

The `pollService.js` file provides methods to interact with the backend API

for fetching and adding polls.

```javascript
import { makeAuthorizedRequest } from "./client";

export const getPolls = (token) => {
  return makeAuthorizedRequest("GET", "/poll/get-poll", null, token);
};

export const addPolls = (data, token) => {
  return makeAuthorizedRequest("POST", "/poll/create-poll", data, token);
};

export const votePolls = (data, token) => {
  return makeAuthorizedRequest("POST", "/poll/vote-poll", data, token);
};
```

### Poll Modal

The `PollModal` component is a modal dialog for adding a new poll.

```javascript
import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const PollModal = ({ isVisible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState(["", ""]);

  const addAnswerField = () => {
    setAnswers([...answers, ""]);
  };

  const handleSave = () => {
    try {
      form.validateFields().then((values) => {
        onSave({ ...values, answers });
        form.resetFields();
        setAnswers(["", ""]);
      });
    } catch (error) {}
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
          rules={[{ required: true, message: "Please input the question!" }]}
        >
          <Input placeholder="Enter your question" />
        </Form.Item>
        {answers.map((answer, index) => (
          <Form.Item
            key={index}
            label={`Answer ${index + 1}`}
            rules={[{ required: true, message: "Please input the answer!" }]}
          >
            <Input
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
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
```

### Poll Card

The `PollCard` component displays a single poll.

```javascript
import React from "react";
import {
  Card,
  Radio,
  Typography,
  Progress,
  Button,
  Form,
  notification,
} from "antd";
import { votePolls } from "../../../services/PollService";

const { Title, Text } = Typography;

const PollCard = ({ poll }) => {
  const [value, setValue] = React.useState(
    poll.options.find((option) => option.votedByUser)?._id || ""
  );

  const handleVote = (values) => {
    console.log("View submitted:", values);
  };

  const onChange = async (e) => {
    if (poll.answered)
      return notification.error({
        message: "Question is required",
        description: "Please enter a question",
      });
    let data = {
      poll_id: e.target.value,
      _id: poll._id,
    };
    try {
      let { data: votePollData } = await votePolls(
        data,
        JSON.parse(localStorage.getItem("userData"))?.token
      );
      if (votePollData.code === 200) {
        return notification.success({
          message: "Poll Added",
          description: "Your poll has been added successfully.",
        });
      }
    } catch (error) {
      return notification.error({
        message: "Some error occurred while saving",
        description:
          error?.message ??
          error?.response?.data?.message ??
          "Something went wrong",
      });
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        backgroundColor: "#075E54",
        color: "#fff",
        borderRadius: 10,
        padding: "20px",
      }}
    >
      <Title level={4} style={{ color: "#fff" }}>
        {poll.question} ?
      </Title>
      <Text style={{ color: "#fff" }}>Select one or more</Text>
      <Form onFinish={handleVote}>
        <Form.Item name="vote">
          <Radio.Group
            style={{ width: "100%" }}
            onChange={onChange}
            value={value}
            defaultValue={
              poll.options.find((option) => option.votedByUser)?._id || ""
            }
            disabled={poll.answered}
          >
            {poll.options.map((item, index) => {
              return (
                <div key={item._id} style={{}}>
                  <Radio
                    value={item._id}
                    key={item._id}
                    style={{ color: "#fff" }}
                  >
                    {item.answer}
                  </Radio>
                  <Progress
                    percent={(item.votes / poll.answeredCount) * 100}
                    showInfo={false}
                    strokeColor="#128C7E"
                  />
                </div>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <div style={{ textAlign: "right", color: "#fff" }}>9:19 am</div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginTop: 10,
              backgroundColor: "#25D366",
              borderColor: "#25D366",
            }}
          >
            View votes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PollCard;
```

### Chat Screen

## Running the Application

To run the application locally:

```bash
npm start
# or
yarn start
```

This will start the development server and open the application in your default web browser.
