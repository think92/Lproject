import React, { useEffect, useState } from "react";
import MainBar from "./MainBar";
import "./css/Customer.css";
import axios from "axios";

const pagesize = 8;

const inquiries = [];

const Customer = () => {
  const [inquiri, setInquiri] = useState([]);
  const [inquirilength, setInquiriLength] = useState([]);

  useEffect(() => {
    boardList();
    console.log("length : ", inquiri);
  }, []);
  const boardList = () => {
    axios
      .post("http://localhost:8083/Customer/BoardList", {})
      .then((res) => {
        setInquiri(res.data);
        setInquiriLength(res.data.length);
        console.log(res.data);
      })
      .catch((res) => {
        // console.log("fail:",inquiri.length);
      });
  };

  // 날짜 변경하기
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().replace("T", " ").split(".")[0];
    return formattedDate;
  };

  const [currentPage, setCurrenPage] = useState(1); // 현재 페이지 상태
  const [currentGroup, setCurrenGroup] = useState(1); // 현재 페이지 그룹 상태

  const totalPages = Math.ceil(inquirilength / pagesize); // 총 페이지 수
  const totalGroups = Math.ceil(totalPages / 3); // 그룹당 3개 페이지

  const startIndex = (currentPage - 1) * pagesize;
  const dispalyedInquiries = inquiri
    .sort((a, b) => b.test_idx - a.test_idx)
    .slice(startIndex, startIndex + pagesize);
  const handlePreviousGroup = () => {
    if (currentGroup > 1) {
      setCurrenPage(currentGroup - 1); // 이전 그룹으로
      setCurrenGroup((currentGroup - 2) * 3 + 1); // 그룸의 첫 페이지로 이동
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < totalGroups) {
      setCurrenPage(Math.ceil(currentPage / 3) * 4); // 0으로 세팅하고 3 곱하기 페이징
      setCurrenGroup(Math.ceil(currentPage / 3 + 1)); // 그룹의 다음 첫 페이지
    }
  };

  const handlePageClick = (page) => {
    setCurrenPage(page);
  };

  const getCurrentGroupPages = () => {
    const start = (currentGroup - 1) * 3 + 1; // 그룹의 첫 페이지 번호
    const end = Math.min(start + 2, totalPages); // 그룹의 마지막 페이지 번호
    console.log("start, end        : ", start, end);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div>
      <MainBar />
      <section className="customerbody">
        <div className="customerbox1">
          <div className="customertab">
            <div className="customerinquiry">
              <h1 className="customerinquirys">문의내역</h1>
              <div>
                <select name="choice" className="customerselectbox">
                  <option className="opt">전체</option>
                  <option>모자이크 관련</option>
                  <option>서비스 이용</option>
                  <option>프리미엄 결제</option>
                  <option>기타</option>
                  <option>신고</option>
                </select>
              </div>
              <div className="customersearch">
                <input
                  type="text"
                  placeholder="검색"
                  className="searchinput"
                ></input>
                <div>
                  <button className="searchbtn">
                    <img
                      src="./img/search.png"
                      className="searchicon"
                      alt="검색"
                      onClick={boardList}
                    ></img>
                  </button>
                </div>
              </div>
            </div>
            <table className="customertable">
              <thead>
                <tr>
                  <th className="customernum">번호</th>
                  <th className="customerdivison">문의제목</th>
                  <th className="customerwriter">작성자</th>
                  <th className="customerdate">작성일시</th>
                  <th className="customeranswer">답변</th>
                </tr>
              </thead>
              <tbody>
                {dispalyedInquiries.map((inquiry) => (
                  <tr key={inquiry.num}>
                    <td className="customernums">{inquiry.test_idx}</td>
                    <td className="customerdivisons">
                      {inquiry.test_title === "비공개 글 입니다." && (
                        <img
                          src="./img/secured-lock.png"
                          className="lockicon"
                          alt="잠금"
                        ></img>
                      )}
                      {inquiry.test_title !== "비공개 글 입니다." && (
                        <img
                          src="./img/padlock-unlock.png"
                          className="lockicon"
                          alt="잠금해제"
                        ></img>
                      )}

                      {inquiry.test_title}
                    </td>
                    <td className="customerwriters">{inquiry.test_context}</td>
                    <td className="customerdates">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="customeranswers">{inquiry.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* 작성하기 버튼 */}
            <div className="customerwrite">
              <button className="customerwrites">작성하기</button>
            </div>

            <div className="customerarrow">
              <div>
                <button
                  className="arrowbtn"
                  onClick={handlePreviousGroup}
                  disabled={currentGroup <= 1}
                >
                  <img
                    src="./img/arrow-circle-left.png"
                    className="arrowlefticon"
                    alt="이전 그룹"
                  ></img>
                </button>
              </div>

              {/* 페이지 번호 버튼 생성 */}
              <div className="pagenum">
                {getCurrentGroupPages().map((page) => (
                  <button
                    className="pagenums"
                    key={page}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* <div className="pagenum">
                <span className="pagenums">
                  {currentPage} {totalPages}
                </span>
              </div> */}

              <div>
                <button
                  className="arrowbtn"
                  onClick={handleNextGroup}
                  disabled={currentGroup >= totalGroups}
                >
                  <img
                    src="./img/arrow-circle-right.png"
                    className="arrowrighticon"
                    alt="다음 페이지"
                  ></img>
                </button>
              </div>
            </div>
          </div>

          <span className="customerbox2">
            <h1 className="customerservice">고객센터</h1>
          </span>
        </div>
      </section>
    </div>
  );
};

export default Customer;
