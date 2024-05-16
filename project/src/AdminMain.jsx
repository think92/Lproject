import React, { useState, useEffect } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminMain.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCalendarWeek,
  faFaceGrinWide,
} from "@fortawesome/free-solid-svg-icons";
import MonthlySubscribersChart from "./component/MonthlySubscribersChart "; // 그래프 컴포넌트 임포트
import {
  RegularSignupChart,
  PremiumSignupChart,
  regularData,
  premiumData,
} from "./component/WeekChart";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./component/LoadingSpinner";

const AdminMain = () => {
  const [board, setBoard] = useState([]);
  const [todayCount, setTodayCount] = useState(0); // 오늘 등록된 문의 수
  const [waitingCount, setWaitingCount] = useState(0); // 대기 중인 문의 수
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    boardList();
    console.log("length : ", board);
  }, []);

  const boardList = () => {
    axios
      .post("http://localhost:8083/AdmApi/adminInquiry", {})
      .then((res) => {
        const data = res.data.aQstnsList || [];
        setBoard(data);
        console.log(data);

        // 오늘 날짜와 비교
        const today = new Date().toISOString().split("T")[0];
        const todayInquiries = data.filter(
          (inquiry) => inquiry.questioned_at.split("T")[0] === today
        ).length;
        setTodayCount(todayInquiries);

        // 대기 중인 문의 수 계산
        const waitingInquiries = data.filter(
          (inquiry) => inquiry.qstn_open === "N"
        ).length;
        setWaitingCount(waitingInquiries);
        setIsLoading(false); // 데이터 로드 완료
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false); // 데이터 로드 완료
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="summary">
        <div className="topconTainer">
          <div className="inqure">
            <div className="inqureHead">
              <h1>문의사항</h1>
              <Link to={"/AdminInquiry"}>+더 보기</Link>
            </div>
            <hr />
            <div className="detail">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>번호</th>
                    <th style={{ width: "40%" }}>구분</th>
                    <th style={{ width: "15%" }}>문의자 명</th>
                    <th style={{ width: "20%" }}>작성일시</th>
                    <th style={{ width: "15%" }}>답변</th>
                  </tr>
                </thead>
                <tbody>
                  {board
                    .sort(
                      (a, b) =>
                        new Date(b.questioned_at) - new Date(a.questioned_at)
                    )
                    .slice(0, 5)
                    .map((qstns, index) => (
                      <tr key={qstns.qstn_title + index}>
                        <td>{index + 1}</td>
                        <td>{qstns.qstn_title}</td>
                        <td>{qstns.mb_email}</td>
                        <td>{formatDate(qstns.questioned_at)}</td>
                        <td>
                          {qstns.qstn_open === "N" ? "대기 중" : "답변 완료"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="summaryDetail">
                <div className="detailBorder">
                  <p className="newTitle">문의 등록</p>
                  <p className="newCount">
                    <span className="newConutI">{todayCount}</span>건
                  </p>
                </div>
                <div className="detailBorder">
                  <p className="addC">문의 대기</p>
                  <p className="addCount">
                    <span className="newConutI">{waitingCount}</span>건
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="membership">
            <div className="inqureHead">
              <h1>회원관리</h1>
              <Link to={"/AdminUser"}>
                <p>+더 보기</p>
              </Link>
            </div>
            <hr />
            <div className="detail">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>번호</th>
                    <th style={{ width: "15%" }}>아이디</th>
                    <th style={{ width: "20%" }}>등급</th>
                    <th style={{ width: "25%" }}>가입일시</th>
                    <th style={{ width: "25%" }}>프리미엄 결재 일시</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>일반</td>
                    <td>홍길동</td>
                    <td>2022-09-15</td>
                    <td>대기 중</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>일반</td>
                    <td>홍길동</td>
                    <td>2022-09-15</td>
                    <td>대기 중</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>일반</td>
                    <td>홍길동</td>
                    <td>2022-09-15</td>
                    <td>대기 중</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>일반</td>
                    <td>홍길동</td>
                    <td>2022-09-15</td>
                    <td>대기 중</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>일반</td>
                    <td>홍길동</td>
                    <td>2022-09-15</td>
                    <td>대기 중</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="subscriber ">
          <div className="inqureHead">
            <h1>가입자 현황</h1>
            <p>+더 보기</p>
          </div>
          <hr />
          <div className="subscriberDetail">
            <div className="newSubscriber">
              <div className="newSubscriberTitle">
                <FontAwesomeIcon icon={faCalendarDays} />
                <h1>5월 신규 가입자</h1>
              </div>
              <div className="chart">
                <MonthlySubscribersChart />
              </div>
            </div>
            <div className="weekchars">
              <div className="newSubscriberShort">
                <div className="newSubscriberShortTitle">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <h1>신규 가입(5~4주차)</h1>
                </div>
                <div className="chartTotal">
                  <div className="weekChart">
                    <RegularSignupChart data={regularData} />
                  </div>
                  <div>
                    <div className="weekChartTotla">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        일주일 <span className="conDe"> 35명</span>
                      </span>{" "}
                    </div>
                    <div className="weekChartTotla">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        한달 <span className="conDe"> 35명</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="newSubscriberVeryShort">
                <div className="newSubscriberVeryShortTitle">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <h1>프리미엄 가입(5~4주차)</h1>
                </div>
                <div className="chartTotal">
                  <div className="weekChart">
                    <PremiumSignupChart data={premiumData} />
                  </div>
                  <div>
                    <div className="weekChartTotla red">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        일주일 <span className="conDe"> 35명</span>
                      </span>{" "}
                    </div>
                    <div className="weekChartTotla red">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        한달 <span className="conDe"> 33명</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
