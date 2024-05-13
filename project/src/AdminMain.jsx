import React from "react";
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

const AdminMain = () => {
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
              <div className="summaryDetail">
                <div className="detailBorder">
                  <p className="newTitle">신규 문의</p>
                  <p className="newCount">
                    <span className="newConutI">3</span>건
                  </p>
                </div>
                <div className="detailBorder">
                  <p className="answerC">답변 완료</p>
                  <p className="answerCount">
                    <span className="answerConutI">2</span>건
                  </p>
                </div>
                <div className="detailBorder">
                  <p className="addC">추가 댓글</p>
                  <p className="addCount">
                    <span className="addConutI">3</span>건
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="membership">
            <div className="inqureHead">
              <h1>회원관리</h1>
              <Link to={"/AdminInquiry"}>
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
