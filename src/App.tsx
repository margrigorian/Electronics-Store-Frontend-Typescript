import style from "./App.module.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./hoc/ScrollToTheTop";
import NavBar from "./components/navbar/NavBar";
import HomePage from "./pages/home_page/HomePage";
import Footer from "./components/footer/Footer";

const App: React.FC = () => {
    return (
        <div>
            <BrowserRouter>
                <NavBar />
                <ScrollToTop />

                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                </Routes>

                <div className={style.wrapper}>
                    <div className={style.content}></div>
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
