import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
            <Link to={"/"}>
              <img src="./img/블러블라 로고(white).png" />
            </Link>
          </div>
          <div className="menu">
            <Link to={"/Editor"}>모자이크 처리</Link>
            <Link to={"/"}>프리미엄 가입</Link>
            <Link to={"/"}>고객센터</Link>
            <Link to={"/"}>로그인</Link>
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
