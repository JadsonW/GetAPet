import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

//Layouts
import Navbar from "./components/layout/Navbar/Navbar";

//Pages
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Resgister";
import Home from "./components/pages/home/Home";
import Footer from "./components/layout/Footer/Footer";
import Container from "./components/layout/Container/Container";
import Message from "./components/layout/Message/Message";
import Profile from "./components/pages/User/Profile/Profile";

//Context
import { FunctionsProvider } from "./context/functionsContext";
import { UserProvider } from "./context/UserContext";

import PetProfile from "./components/pages/Pet/PetProfile";

function App() {
  return (
    <Router>
      <UserProvider>
        <FunctionsProvider>
          <Navbar />
          <Message />
          <Container>
            <Routes>
              <Route path="/pet/:id" element={<PetProfile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create" element={<Register />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
          <Footer />
        </FunctionsProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
