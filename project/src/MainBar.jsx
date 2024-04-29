import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const MainBar = () => {
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    rel="stylesheet"
  />;

  return (
    <header>
      <section>
        <div id="mainbar">
          <div className="logo">
            <a href="">
              <img src="./img/블러블라 로고(white).png" />
            </a>
          </div>
          <div className="menu">
            <a href="">모자이크 처리</a>
            <a href="">프리미엄 가입</a>
            <a href="">고객센터</a>
            <a href="">로그인</a>
            <a>
              <FontAwesomeIcon icon={faBell} className="bell" />
            </a>
          </div>
        </div>
      </section>
    </header>
  );
};

export default MainBar;
