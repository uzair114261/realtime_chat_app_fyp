import React, { createContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Testing from "./pages/Testing";
import { ToastProvider } from "./CustomHooks/ToastContext";
import ChatApp from "./chatapp/ChatApp";
import { ChatStatesProvider } from "./chatapp/ChatStates";
import { SocketProvider } from "./provider/SocketProvider";


function App() {
  return (
    <div className="">
      <SocketProvider>
        <ToastProvider>
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
        </ToastProvider>
      </SocketProvider>
    </div>
  );
}
export default App;
