import { useEffect, useState } from "react";
import "./css/Mypage.css";
import MypageBar from "./MypageBar";
import axios from "axios";
import { Link } from "react-router-dom";

const Mypage = () => {
  // const [today, setToday] = useState(new Date()); // 오늘 날자
  const [memberImage, setMemberImage] = useState([]); // 회원의 모든 작업내역
  const [selectedDate, setSelectedDate] = useState(); // 선택한 날짜 (예시)
  const [medias, setMedias] = useState([]); // 세션 미디어 관련

  const formData = new FormData();
  formData.append("mb_email", sessionStorage.getItem("mb_email"));

  useEffect(() => {
    // 회원의 모든 작업내역 불러오기
    axios
      .post("http://localhost:8083/MemApi/Mypage", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setMemberImage(res.data); // 회원 작업내역의 이미지 정보 배열형식
        // 날자 정렬
        setSelectedDate(
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        console.log(
          "정렬 : ",
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        console.log("■■■■■ medias : ", sessionStorage.getItem("medias"));
      })
      .catch((err) => {
        console.error("Error data:", err);
      });
  }, []);

  // 날자별 미디어 분류
  const imagesByDate = memberImage.reduce((acc, memberImage) => {
    if (!acc[memberImage.createdAt.split("T")[0]]) {
      acc[memberImage.createdAt.split("T")[0]] = [];
    }
    acc[memberImage.createdAt.split("T")[0]].push(memberImage);
    return acc;
  }, {});

  // 체크박스 클릭시 미디어 정보 넣기 2
  const [checkedList, setCheckedList] = useState([]);

  const checkedItemHandler = (value, isChecked) => {
    console.log("작동2");
    if (isChecked) {
      setCheckedList((prev) => [...prev, value]);
    } else {
      setCheckedList(checkedList.filter((item) => item !== value));
    }
  };

  // 체크박스 클릭시 미디어 정보 넣기 1
  const handleCheckboxChange = (e, value) => {
    console.log("작동1");
    const isChecked = e.target.checked;
    checkedItemHandler(value, isChecked);
  };

  // 수정시 세션에 회원이메일 기준으로 미디어 정보 넣기
  const mediasUpdate = () => {
    const mb_email = sessionStorage.getItem("mb_email");
    if (mb_email) {
      sessionStorage.setItem("medias", JSON.stringify(checkedList));
    }
  };

  return (
    <div>
      <MypageBar />
      <section className="mypageTool">
        <div className="ToolBody">
          <div className="ToolListBody">
            <p className="ToolList">작업내역</p>
            <div className="MypageNavbar">
              <div>
                <Link to={"/Editor"} className="EditorBoxBody">
                  모자이크 처리
                </Link>
              </div>
              <div>
                <Link to={"/Premium"} className="PremiumBoxBody">
                  프리미엄 가입
                </Link>
              </div>
              <div>
                <Link to={"/Customer"} className="CustomerBoxBody">
                  고객센터
                </Link>
              </div>
            </div>
          </div>
          <hr className="toolhr" />
          <div className="ToolBodys">
            <input type="date" id="date" className="tooldate"></input>
            {/* 스크롤바 전체 창 */}
            <div className="ToolTotal">
              {Object.keys(imagesByDate).map((date) => (
                <div>
                  <div className="MosaicDate">
                    <div className="MosaicDates">{date}</div>
                    <div>
                      <button className="MosaicFix" onClick={mediasUpdate}>
                        수정
                      </button>
                    </div>
                  </div>

                  {/* ////////////////////////////// */}
                  <div className="MosaicImg">
                    {imagesByDate[date].map((image) => (
                      <div key={image.file_idx}>
                        <div className="ImgCheckBox">
                          <img
                            className="MosaicImgs"
                            src={`https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${image.file_name}`}
                            alt=""
                          />
                          <input
                            type="checkbox"
                            id="ImgCheck"
                            onChange={(e) =>
                              handleCheckboxChange(
                                e,
                                `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_REGION}.amazonaws.com/${image.file_name}`
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ///////////////////////////////////// */}
                  {/* <div className="MosaicDate2">
                  <div className="MosaicDates">2024-05-07</div>
                  <div>
                    <button className="MosaicFix">수정</button>
                  </div>
                </div> */}
                  {/* <div className="MosaicImg">
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                  <div className="MosaicImgs">
                    <div className="ImgCheck"></div>
                  </div>
                </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mypage;
