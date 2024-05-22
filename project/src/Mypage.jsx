import { useEffect } from "react";
import "./css/Mypage.css";
import MypageBar from "./MypageBar";
import axios from "axios";

const Mypage = () => {
  const formData = new FormData();
  formData.append("mb_email", sessionStorage.getItem("mb_email"));

  useEffect(() => {
    axios
      .post("http://localhost:8083/MemApi/Mypage", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error data:", err);
      });
  }, []);

  return (
    <div>
      <MypageBar />
      <section className="mypageTool">
        <div className="ToolBody">
          <p className="ToolList">작업내역</p>
          <hr className="toolhr" />
          <div className="ToolBodys">
            <input type="date" id="date" className="tooldate"></input>
            {/* 스크롤바 전체 창 */}
            <div className="ToolTotal">
              <div className="MosaicDate">
                <div className="MosaicDates">2024-05-08</div>
                <div>
                  <button className="MosaicFix">수정</button>
                </div>
              </div>
              <div className="MosaicImg">
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
              </div>

              <div className="MosaicDate2">
                <div className="MosaicDates">2024-05-07</div>
                <div>
                  <button className="MosaicFix">수정</button>
                </div>
              </div>
              <div className="MosaicImg">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mypage;
