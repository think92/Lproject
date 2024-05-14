import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { LoginUserContext } from "./context/LoginUserContent";

const MainBar = () => {
  // 로그인한 회원 정보 저장하는 변수(아이디, 등급)
  const { login_id, setLogin_id, login_role, setLogin_role } =
    useContext(LoginUserContext);

  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    rel="stylesheet"
  />;

  function LogOut(params) {
    setLogin_id(false); // 로그인(id) 로그아웃(false) 상태로 설정할것..!
  }

  const [content, setContent] = useState("");
  console.log(content);

  return (
    <header>
      <section>
        <div id="mainbar">
          <div className="logo">
            <Link to={"/"}>
              <img src="./img/blurbla_logo(white).png" alt="logowhite" />
            </Link>
          </div>
          <div className="menu">
            <Link to={"/Editor"}>모자이크 처리</Link>
            <Link to={"/Premium"}>프리미엄 가입</Link>
            <Link to={"/Customer"}>고객센터</Link>

            {/* 회원정보가 없으면 헤더에 로그인 */}
            {false === login_id && <Link to={"/Login"}>로그인</Link>}

            {/* 회원정보가 있으면 헤더에 로그아웃, 마이페이지, 벨 */}
            {false !== login_id && <Link onClick={LogOut}>로그아웃</Link>}
            {false !== login_id && <Link to={"/Mypage"}>마이페이지</Link>}
            {false !== login_id && (
              <a>
                <FontAwesomeIcon icon={faBell} className="bell" />
              </a>
            )}
          </div>
        </div>
      </section>
    </header>
  );
};

export default MainBar;
