import React from "react";
import "./css/adminMainBody.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const AdminMain = () => {
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
          <p>● 대시보드</p>
          <p>● 문의사항</p>
          <p>● 회원관리</p>
          <p>● 기능 업데이트</p>
          <p>● 알림 서비스</p>
          <p>● 관리자 권한 설정</p>
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
