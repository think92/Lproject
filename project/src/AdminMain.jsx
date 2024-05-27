import React, { useState, useEffect } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminMain.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCalendarWeek, faFaceGrinWide } from "@fortawesome/free-solid-svg-icons";
import MonthlySubscribersChart from "./component/MonthlySubscribersChart ";
import { RegularSignupChart, PremiumSignupChart } from "./component/WeekChart";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminMain = () => {
  const [board, setBoard] = useState([]);
  const [users, setUsers] = useState();
  const [todayCount, setTodayCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    regular: [],
    premium: [],
  });
  const [weeklyData, setWeeklyData] = useState({
    regular: [],
    premium: [],
  });

  useEffect(() => {
    boardList();
    fetchUsersData();
    fetchPremiumUsersData();
  }, [selectedDate, selectedWeek]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(Number(event.target.value));
  };

  const boardList = () => {
    axios
      .post(`http://${process.env.REACT_APP_IP}:8083/AdmApi/adminMain`, {})
      .then((res) => {
        const data = res.data.aQstnsList || [];
        setBoard(data);

        const today = new Date().toISOString().split("T")[0];
        const todayInquiries = data.filter(
          (inquiry) => inquiry.questioned_at.split("T")[0] === today
        ).length;
        setTodayCount(todayInquiries);

        const waitingInquiries = data.filter(
          (inquiry) => inquiry.qstn_answer === "N"
        ).length;
        setWaitingCount(waitingInquiries);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  };

  const getWeekNumber = (date) => {
    const day = date.getDate();
    if (day >= 1 && day <= 4) return 1;
    else if (day >= 5 && day <= 11) return 2;
    else if (day >= 12 && day <= 18) return 3;
    else if (day >= 19 && day <= 25) return 4;
    else return 5;
  };

  const fetchUsersData = () => {
    axios
      .post(`http://${process.env.REACT_APP_IP}:8083/AdmApi/adminMain`, {})
      .then((res) => {
        const data = res.data.aMemberList || [];
        setUsers(data.length);

        if (Array.isArray(data)) {
          const month = selectedDate.getMonth() + 1;
          const year = selectedDate.getFullYear();

          const weeklyRegularData = Array.from({ length: 5 }, () =>
            Array(7).fill(0)
          );
          const dailyCounts = Array(31).fill(0);
          let recentUsersList = [];

          data.forEach((user) => {
            const userDate = new Date(user.joinedAt);
            if (
              userDate.getMonth() + 1 === month &&
              userDate.getFullYear() === year
            ) {
              const day = userDate.getDate() - 1;
              dailyCounts[day]++;
              recentUsersList.push(user);
              const week = getWeekNumber(userDate);
              if (week >= 1 && week <= 5) {
                const dayOfWeek = userDate.getDay();
                weeklyRegularData[week - 1][dayOfWeek]++;
              }
            }
          });

          recentUsersList = recentUsersList.sort(
            (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)
          );

          setRecentUsers(recentUsersList.slice(0, 5));

          const labels = [];
          const regularCounts = [];

          for (let i = 0; i < dailyCounts.length; i += 5) {
            labels.push(`${month}월 ${i + 1}일`);
            regularCounts.push(
              dailyCounts.slice(i, i + 5).reduce((acc, count) => acc + count, 0)
            );
          }

          setMonthlyData((prevData) => ({
            ...prevData,
            labels: labels,
            regular: regularCounts,
          }));

          setWeeklyData((prevData) => ({
            ...prevData,
            regular: weeklyRegularData,
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching users data", err);
      });
  };

  const fetchPremiumUsersData = () => {
    axios
      .post(`http://${process.env.REACT_APP_IP}:8083/AdmApi/adminMain`, {})
      .then((res) => {
        const payData = res.data.aPayMemberList || [];

        if (Array.isArray(payData)) {
          const month = selectedDate.getMonth() + 1;
          const year = selectedDate.getFullYear();

          const weeklyPremiumData = Array.from({ length: 5 }, () =>
            Array(7).fill(0)
          );
          const premiumCounts = Array(31).fill(0);

          payData.forEach((user) => {
            const userDate = new Date(user.joinedAt);
            if (
              userDate.getMonth() + 1 === month &&
              userDate.getFullYear() === year
            ) {
              const day = userDate.getDate() - 1;
              premiumCounts[day]++;
              const week = getWeekNumber(userDate);
              if (week >= 1 && week <= 5) {
                const dayOfWeek = userDate.getDay();
                weeklyPremiumData[week - 1][dayOfWeek]++;
              }
            }
          });

          const premiumCountsAggregated = [];

          for (let i = 0; i < premiumCounts.length; i += 5) {
            premiumCountsAggregated.push(
              premiumCounts
                .slice(i, i + 5)
                .reduce((acc, count) => acc + count, 0)
            );
          }

          setMonthlyData((prevData) => ({
            ...prevData,
            premium: premiumCountsAggregated,
          }));

          setWeeklyData((prevData) => ({
            ...prevData,
            premium: weeklyPremiumData,
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching premium users data", err);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeeklyDataForSelectedWeek = () => {
    const weekIndex = selectedWeek - 1;
    const regularData = weeklyData.regular[weekIndex] || [];
    const premiumData = weeklyData.premium[weekIndex] || [];

    return {
      regular: regularData,
      premium: premiumData,
    };
  };

  const weeklyDataForSelectedWeek = getWeeklyDataForSelectedWeek();

  const getCategoryName = (category) => {
    switch (category) {
      case "T":
        return "전체";
      case "I":
        return "모자이크";
      case "S":
        return "서비스";
      case "P":
        return "프리미엄";
      case "G":
        return "기타";
      case "R":
        return "신고";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div className="admin">
      <AdminMinBar />
      <div className="summary">
        <div className="topconTainer">
          <div className="inqure">
            <div className="inqureHead">
              <h1>문의사항</h1>
              <Link to={"/AdminInquiry"} className="Addeye">
                +더 보기
              </Link>
            </div>
            <hr />
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
                  <span className="newConutIes">{waitingCount}</span>건
                </p>
              </div>
            </div>
            <div className="detail">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>번호</th>
                    <th style={{ width: "8%" }}>항목</th>
                    <th style={{ width: "35%" }}>문의제목</th>
                    <th style={{ width: "10%" }}>문의자 명</th>
                    <th style={{ width: "12%" }}>작성일시</th>
                    <th style={{ width: "8%" }}>답변</th>
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
                        <td>{getCategoryName(qstns.qstn_category)}</td>
                        <td className="adminTitle">{qstns.qstn_title}</td>
                        <td>{qstns.mb_email}</td>
                        <td>{formatDate(qstns.questioned_at)}</td>
                        <td
                          className={
                            qstns.qstn_answer === "N" ? "redText" : "blackText"
                          }
                        >
                          {qstns.qstn_answer === "N" ? "대기 중" : "답변 완료"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="membership">
            <div className="inqureHead">
              <h1>회원관리</h1>
              <Link to={"/AdminUser"} className="Addeye">
                +더 보기
              </Link>
            </div>
            <hr />
            <div className="totalUsers">
              <div className="totalBorder">
                <p className="totalUserTitle">전체 회원</p>
                <p className="totalCount">
                  <span className="totalConutI">{users}</span>명
                </p>
              </div>
            </div>
            <div className="detail">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>번호</th>
                    <th style={{ width: "15%" }}>아이디</th>
                    <th style={{ width: "20%" }}>등급</th>
                    <th style={{ width: "25%" }}>가입일시</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={user.mb_email}>
                      <td>{index + 1}</td>
                      <td>{user.mb_email}</td>
                      <td>{user.mb_role}</td>
                      <td>{formatDate(user.joinedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="subscriber">
          <div className="inqureHead">
            <h1>가입자 현황</h1>
          </div>
          <hr />
          <div className="subscriberDetail">
            <div className="newSubscriber" style={{ flex: 1.6, marginRight: '10px', boxSizing: 'border-box' }}>
              <div className="newSubscriberTitle">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  customInput={<FontAwesomeIcon icon={faCalendarDays} />}
                />
                <h1>
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 신규 가입자
                </h1>
                <div className="weekSelection">
                  <select id="week" value={selectedWeek} onChange={handleWeekChange}>
                    <option value={1}>1주차</option>
                    <option value={2}>2주차</option>
                    <option value={3}>3주차</option>
                    <option value={4}>4주차</option>
                    <option value={5}>5주차</option>
                  </select>
                </div>
              </div>
              <div className="chart" style={{ width: '1050px', height: '340px' }}>
                <MonthlySubscribersChart monthlyData={monthlyData} />
              </div>
            </div>

            <div className="weekchars" style={{ flex: 1, marginLeft: '10px', boxSizing: 'border-box' }}>
              <div className="newSubscriberShort" style={{ flex: '1 1 100%', boxSizing: 'border-box' }}>
                <div className="newSubscriberShortTitle">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <h1>신규 가입({selectedWeek}주차)</h1>
                </div>
                <div className="chartTotal">
                  <div className="weekChart" style={{ width: '100%', height: '200px' }}>
                    <RegularSignupChart
                      data={{
                        labels: ["일", "월", "화", "수", "목", "금", "토"],
                        datasets: [
                          {
                            label: "신규 가입자 수",
                            data: weeklyDataForSelectedWeek.regular,
                          },
                        ],
                      }}
                    />
                  </div>
                  <div>
                    <div className="weekChartTotla">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        일주일{" "}
                        <span className="conDe">
                          {weeklyDataForSelectedWeek.regular.reduce((a, b) => a + b, 0)}명
                        </span>
                      </span>{" "}
                    </div>
                    <div className="weekChartTotla">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        한달{" "}
                        <span className="conDe">
                          {monthlyData.regular
                            ? monthlyData.regular.reduce((a, b) => a + b, 0)
                            : 0}명
                        </span>
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="newSubscriberVeryShort" style={{ flex: '1 1 100%', boxSizing: 'border-box' }}>
                <div className="newSubscriberVeryShortTitle">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <h1>프리미엄 가입({selectedWeek}주차)</h1>
                </div>
                <div className="chartTotal">
                  <div className="weekChart" style={{ width: '100%', height: '200px' }}>
                    <PremiumSignupChart
                      data={{
                        labels: ["일", "월", "화", "수", "목", "금", "토"],
                        datasets: [
                          {
                            label: "프리미엄 가입자 수",
                            data: weeklyDataForSelectedWeek.premium,
                          },
                        ],
                      }}
                    />
                  </div>
                  <div>
                    <div className="weekChartTotla red">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        일주일{" "}
                        <span className="conDe">
                          {weeklyDataForSelectedWeek.premium.reduce((a, b) => a + b, 0)}명
                        </span>
                      </span>{" "}
                    </div>
                    <div className="weekChartTotla red">
                      <FontAwesomeIcon className="emo" icon={faFaceGrinWide} />
                      <span className="con">
                        한달{" "}
                        <span className="conDe">
                          {monthlyData.premium
                            ? monthlyData.premium.reduce((a, b) => a + b, 0)
                            : 0}명
                        </span>
                      </span>{" "}
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
