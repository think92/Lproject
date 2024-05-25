import { useEffect, useState } from "react";
import "./css/Mypage.css";
import MypageBar from "./MypageBar";
import axios from "axios";
import { Link } from "react-router-dom";

const Mypage = () => {
  const [today, setToday] = useState(new Date()); // 오늘 날자
  const [memberImage, setMemberImage] = useState([]); // 회원의 모든 작업내역
  const [selectedDate, setSelectedDate] = useState(); // 선택한 날짜 (예시)

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
        setSelectedDate(
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        console.log("날자추출 : ", res.data[0].createdAt.split("T")[0]);
        console.log("정렬 : ", selectedDate);
      })
      .catch((err) => {
        console.error("Error data:", err);
      });
  }, []);

  const imagesByDate = memberImage.reduce((acc, memberImage) => {
    if (!acc[memberImage.createdAt.split("T")[0]]) {
      acc[memberImage.createdAt.split("T")[0]] = [];
    }
    acc[memberImage.createdAt.split("T")[0]].push(memberImage);
    return acc;
  }, {});

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
                      <button className="MosaicFix">수정</button>
                    </div>
                  </div>

                  {/* ////////////////////////////// */}
                  <div className="MosaicImg">
                    {imagesByDate[date].map((image) => (
                      <div key={image.file_idx}>
                        <div className="ImgCheckBox">
                          <img
                            className="MosaicImgs"
                            src={
                              "https://s3testsm.s3.amazonaws.com/" +
                              image.file_name
                            }
                            alt=""
                          />
                          <input type="checkbox" id="ImgCheck" />
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
