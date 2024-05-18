import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

//Layouts
import Navbar from "./components/layout/Navbar/Navbar";

//Pages
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Resgister";
import Home from "./components/pages/Home";
import Footer from "./components/layout/Footer/Footer";
import Container from "./components/layout/Container/Container";

//Context
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Register />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
