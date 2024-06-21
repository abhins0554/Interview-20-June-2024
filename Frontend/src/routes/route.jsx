import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../App.css";


// Lazy load components
const Login = lazy(() => import("../pages/login/login"));
const Signup = lazy(() => import("../pages/signup/signup"));
const Home = lazy(() => import("../pages/home/index"));
// const About = lazy(() => import("./component/about"));
// const Contact = lazy(() => import("./component/contact"));

const App = () => {

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>

                    <Route path="/home" element={<Home />}></Route>
                    {/* <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route> */}
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
