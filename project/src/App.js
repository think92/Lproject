import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainBody from "./MainBody";
import Editor from "./Editor";
import Login from "./Login";
import Join from "./Join";
import AdminMain from "./AdminMain";
import { LoginUserContext } from "./context/LoginUserContent";

const App = () => {
  // 로그인시 회원의 필요한 정보
  const [login_id, setLogin_id] = useState(false); // 아이디
  const [login_role, setLogin_role] = useState(false); // 등급

  return (
    <Router>
      <div>
        <LoginUserContext.Provider
          value={{ login_id, setLogin_id, login_role, setLogin_role }}
        >
          <Routes>
            <Route path="/" element={<MainBody />} />
            <Route path="/Editor" element={<Editor />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Join" element={<Join />} />
            <Route path="/Admin" element={<AdminMain />} />
          </Routes>
        </LoginUserContext.Provider>
      </div>
    </Router>
  );
};

export default App;
