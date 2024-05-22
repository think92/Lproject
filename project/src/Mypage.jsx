import "./css/Mypage.css";
import MypageBar from "./MypageBar";
import { Link } from "react-router-dom";

const Mypage = () => {
  return (
    <div>
      <MypageBar />
      <section className="mypageTool">
        <div className="ToolBody">
          <div className="ToolListBody">
            <p className="ToolList">작업내역</p>
            <div className="MypageNavbar">
              <div>
              <Link to={"/Editor"} className="EditorBoxBody">모자이크 처리</Link>
              </div>
              <div>
              <Link to={"/Premium"} className="PremiumBoxBody">프리미엄 가입</Link>
              </div>
              <div>
              <Link to={"/Customer"} className="CustomerBoxBody">고객센터</Link>
              </div>
            </div>
          </div>
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
