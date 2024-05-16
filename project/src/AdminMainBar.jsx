import React from "react";
import "./css/adminMainBody.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const AdminMain = () => {
  const navigate = useNavigate();

  const handleClick = (message) => {
    alert(message);
    navigate("/Admin");
  };

  const changeBtn = {
    backgroundColor: "#4ce577",
  };

  return (
    <section>
      <div className="home">
        <Link to={"/"}>
          <FontAwesomeIcon className="homeIcon" icon={faHouseChimney} />
          <p>메인 홈</p>
        </Link>
      </div>
      <div className="adminIntroduce">
        <img src="./img/blurbla_simbol.png" />
        <p>관리자(admin1)</p>
        <div className="adminMenu">
          <NavLink
            to={"/Admin"}
            style={({ isActive }) => (isActive ? changeBtn : {})}
          >
            <p className="menuList">● 대시보드</p>
          </NavLink>{" "}
          <NavLink
            to={"/AdminInquiry"}
            style={({ isActive }) => (isActive ? changeBtn : {})}
          >
            <p className="menuList">● 문의사항</p>
          </NavLink>
          <NavLink
            to={"/AdminUser"}
            style={({ isActive }) => (isActive ? changeBtn : {})}
          >
            <p className="menuList">● 회원관리</p>
          </NavLink>
          <p
            className="menuList"
            onClick={() => handleClick("페이지 준비중입니다.")}
          >
            ● 기능 업데이트
          </p>
          <p
            className="menuList"
            onClick={() => handleClick("페이지 준비중입니다.")}
          >
            ● 알림 서비스
          </p>
          <p
            className="menuList"
            onClick={() => handleClick("페이지 준비중입니다.")}
          >
            ● 관리자 권한 설정
          </p>
        </div>
      </div>
      <div className="logout">
        <FontAwesomeIcon className="logoutIcon" icon={faRightFromBracket} />
        <p>로그아웃</p>
      </div>
    </section>
  );
};

export default AdminMain;
