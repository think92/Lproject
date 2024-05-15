import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainBody from "./MainBody";
import Editor from "./Editor";
import Login from "./Login";
import Join from "./Join";
import Premium from "./Premium";
import Customer from "./Customer";
import Mypage from "./Mypage";
import AdminMain from "./AdminMain";
import { LoginUserContext } from "./context/LoginUserContent";
import MypageCustom from "./MypageCustom";
import MypagePay from "./MypagePay";
import AdminInquiry from "./AdminInquiry";

const App = () => {
  // 로그인시 회원의 필요한 정보
  const [login_id, setLogin_id] = useState(false); // 아이디
  const [login_role, setLogin_role] = useState(false); // 등급
  const [kakaoLink, setKakaoLink] = useState(); // 카카오결제 주소

  return (
    <Router>
      <div>
        <LoginUserContext.Provider
          value={{
            login_id, // context 아이디
            setLogin_id, // context 아이디 값 저장
            login_role, // context 등급
            setLogin_role, // context 등급값 저장
            kakaoLink, // context 카카오결제 주소
            setKakaoLink, // context 카카오결제 주소 값 저장
          }}
        >
          <Routes>
            <Route path="/" element={<MainBody />} />
            <Route path="/Editor" element={<Editor />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Join" element={<Join />} />
            <Route path="/Premium" element={<Premium />} />
            <Route path="/Customer" element={<Customer />} />
            <Route path="/Mypage" element={<Mypage />} />
            <Route path="/Admin" element={<AdminMain />} />
            <Route path="/MypageCustom" element={<MypageCustom />} />
            <Route path="/MypagePay" element={<MypagePay />} />
            <Route path="/AdminInquiry" element={<AdminInquiry />} />
          </Routes>
        </LoginUserContext.Provider>
      </div>
    </Router>
  );
};

export default App;
