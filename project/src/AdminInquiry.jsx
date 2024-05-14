import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";
import "./css/adminInquiry.css";
import Modal from "./component/Modal"; // 모달 컴포넌트 임포트

const AdminInquiry = () => {
  // 검색창 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectType, setSelectType] = useState("");
  const [inquiries, setInquiries] = useState([]); // 데이터를 저장할 상태
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태

  const initialInquiries = [
    {
      id: 1,
      title: "로그인 문제",
      userId: "user123",
      inquiryDate: "2024-05-12",
      answerStatus: "대기 중",
      answerDate: "-",
    },
    {
      id: 2,
      title: "결제 오류",
      userId: "user456",
      inquiryDate: "2024-05-11",
      answerStatus: "답변 완료",
      answerDate: "2024-05-12",
    },
    {
      id: 3,
      title: "서비스 이용 문의",
      userId: "user789",
      inquiryDate: "2024-05-10",
      answerStatus: "답변 완료",
      answerDate: "2024-05-11",
    },
    {
      id: 4,
      title: "계정 복구 요청",
      userId: "user101",
      inquiryDate: "2024-05-09",
      answerStatus: "대기 중",
      answerDate: "-",
    },
  ];

  // 데이터를 필터링하고 정렬하는 함수
  const filterAndSortInquiries = () => {
    let filtered = initialInquiries.filter((inquiry) => {
      if (selectType && searchTerm) {
        return inquiry[selectType]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    });

    // "대기 중" 상태가 같은 경우, 날짜를 비교하여 오래된 문의를 상위에 배치
    filtered.sort((a, b) => {
      if (a.answerStatus === "대기 중" && b.answerStatus !== "대기 중") {
        return -1;
      } else if (b.answerStatus === "대기 중" && a.answerStatus !== "대기 중") {
        return 1;
      } else if (a.answerStatus === "대기 중" && b.answerStatus === "대기 중") {
        return a.inquiryDate < b.inquiryDate ? -1 : 1;
      }
      return 0;
    });

    setInquiries(filtered);
  };

  useEffect(() => {
    filterAndSortInquiries(); // 초기 로드 시 필터 및 정렬 실행
  }, []);

  const handleSelectTypeChange = (event) => {
    setSelectType(event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    filterAndSortInquiries(); // 검색 실행 시 필터 및 정렬 실행
  };

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalIsOpen(true);
  };
  return (
    <div className="admin">
      <AdminMinBar />
      <div className="start">
        <div className="startIn">
          <h1 className="startTitle">문의사항 관리</h1>
          <hr />
          <div className="summaryDetails">
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
          <hr />
          <div className="buttonss">
            <button className="delete">삭제</button>
            <div className="seletes">
              <select className="select" name="select">
                <option value="">- 문의 종류 -</option>
                <option value="">전체</option>
                <option value="">모자이크 관련</option>
                <option value="">서비스 이용</option>
                <option value="">프리미엄 결제</option>
                <option value="">기타</option>
                <option value="">신고</option>
              </select>
              <select
                className="select"
                name="select"
                value={selectType}
                onChange={handleSelectTypeChange}
              >
                <option value="">- 항목 -</option>
                <option value="userId">아이디</option>
                <option value="title">문의제목</option>
                <option value="inquiryDate">문의일시</option>
                <option value="answerStatus">답변유무</option>
                <option value="answerDate">답변일시</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button className="delete" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>번호</th>
                  <th>문의제목</th>
                  <th>아이디</th>
                  <th>문의일시</th>
                  <th>답변유무</th>
                  <th>답변일시</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{inquiry.id}</td>
                    <td onClick={() => openModal(inquiry)}>{inquiry.title}</td>
                    <td>{inquiry.userId}</td>
                    <td>{inquiry.inquiryDate}</td>
                    <td
                      className={
                        inquiry.answerStatus === "대기 중" ? "red-text" : ""
                      }
                    >
                      {inquiry.answerStatus}
                    </td>
                    <td>{inquiry.answerDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            inquiry={selectedInquiry}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInquiry;
