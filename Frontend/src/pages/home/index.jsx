import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Feed from './components/Feed';
import Poll from './components/Poll';

const Home = () => {

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!localStorage.getItem('userData')) return navigate('/login');
    }, []);

    const posts = [
        { title: 'Post 1', content: 'This is the content of post 1' },
        { title: 'Post 2', content: 'This is the content of post 2' },
    ];

    const polls = [
        { question: 'What is your favorite color?', options: ['Red', 'Blue', 'Green'] },
        { question: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Pasta'] },
    ];

    return (
        <div>
            <h1>Home</h1>
            <Feed posts={posts} />
            <Poll polls={polls} />
        </div>
    );
};

export default Home;
