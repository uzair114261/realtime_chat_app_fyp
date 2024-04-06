import React, { createContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Testing from "./pages/Testing";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatApp from "./chatapp/ChatApp";
import { ChatStatesProvider } from "./chatapp/ChatStates";

export const ToastContext = createContext();

function App() {
  return (
    <div className="">
      <ToastContainer />
      <ToastContext.Provider value={toast}>
        <ChatStatesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ChatApp />} />
              <Route path="/login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="testing" element={<Testing />} />
            </Routes>
          </Router>
        </ChatStatesProvider>
      </ToastContext.Provider>
    </div>
  );
}
export default App;
