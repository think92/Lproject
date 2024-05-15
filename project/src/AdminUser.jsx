import React, { useEffect, useState } from "react";
import AdminMinBar from "./AdminMainBar";

const AdminUser = () => {
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
      content:
        "로그인 시 시스템이 응답하지 않습니다. 여러 번 시도해 보았지만 계속 같은 문제가 발생합니다. 어떻게 해야 하나요?",
    },
    {
      id: 2,
      title: "결제 오류",
      userId: "user456",
      inquiryDate: "2024-05-11",
      answerStatus: "답변 완료",
      answerDate: "2024-05-12",
      content:
        "결제 시도 중 오류 메시지가 표시되었습니다. 카드는 정상적이며 다른 웹사이트에서는 문제없이 사용됩니다. 확인 부탁드립니다.",
    },
    {
      id: 3,
      title: "서비스 이용 문의",
      userId: "user789",
      inquiryDate: "2024-05-10",
      answerStatus: "답변 완료",
      answerDate: "2024-05-11",
      content:
        "서비스 가입 후 사용 방법이 잘 이해되지 않습니다. 기능 사용에 대한 자세한 설명서나 도움말이 필요합니다.",
    },
    {
      id: 4,
      title: "계정 복구 요청",
      userId: "user101",
      inquiryDate: "2024-05-09",
      answerStatus: "대기 중",
      answerDate: "-",
      content:
        "계정 접속이 불가능해졌습니다. 비밀번호 재설정을 시도했으나 등록된 이메일로 메일이 오지 않습니다. 계정 복구를 요청합니다.",
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
                    <td
                      className="clickable "
                      onClick={() => openModal(inquiry)}
                    >
                      {inquiry.title}
                    </td>
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
            </table>``
          </div>
                 </div>
      </div>
    </div>
  );
};

export default AdminUser;
