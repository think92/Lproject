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
            <div className="close">
              <button>X</button>
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
                value={"이메일"}
                className="email"
              ></input>
              <input
                type="email"
                id="pw"
                name="password"
                value={"비밀번호"}
                className="password"
              ></input>
              <button className="loginbtn">로그인</button>
              <div className="find">
                <Link to={"/"} className="find">비밀번호 찾기</Link>
                <p>l</p> 
                <Link to={"/"} className="find">아이디 찾기</Link>
                <p>l</p>
                <Link to={"/"} className="find">회원가입</Link>
              </div>
            </div>
          </span>
          <span className="loginbox2"></span>
        </div>
      </section>
    </div>
  );
};

export default Login;
