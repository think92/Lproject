import React from "react";
import MainBar from "./MainBar";
import "./css/Login.css";
import "./css/mainbar.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <MainBar />
      <section className="loginbody">
        <div className="loginbox1">
          <span className="loginbox3">
            <div className="loginclose">
              <Link to={"/"} className="loginclosebox">X</Link>
            </div>
            <div>
              <img src="./img/blurbla_simbol.png" className="loginsimbol" />
              <img src="./img/blurbla_logo(kr).png" className="logokr" />
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="이메일"
                className="email"
              />
              <input
                type="email"
                id="pw"
                name="password"
                placeholder="비밀번호"
                className="password"
              />
              <Link to={"/"} className="loginbtn">
                로그인
              </Link>
              <div className="find">
                <Link to={"/"} className="find">
                  비밀번호 찾기
                </Link>
                <p>l</p>
                <Link to={"/"} className="find">
                  아이디 찾기
                </Link>
                <p>l</p>
                <Link to={"/Join"} className="find">
                  회원가입
                </Link>
              </div>
            </div>
          </span>
          <span className="loginbox2">
            <div className="terms">
              <p>이용약관</p>
              <p className="point">개인정보 처리방침</p>
              <p>운영정책</p>
              <p>회원정보 고객센터</p>
              <p>공지사항</p>
            </div>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Login;
