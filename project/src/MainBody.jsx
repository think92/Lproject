import React from "react";
import MainBar from "./MainBar";
import "./css/mainbar.css";
import "./css/mainbody.css";
import { Link } from "react-router-dom";

const MainBody = () => {
  return (
    <div className="body">
      <MainBar />
      <section>
        <div id="upload">
          <div className="uploadbackground1">
            <div className="uploadbackground2">
              <div className="uploadtext">
                <h1>무료 온라인 모자이크 에디터</h1>
                <p>Blurbla(블러블라) 무료 온라인 모자이크 에디터로</p>
                <p>사진 및 동영상을 손쉽게 모자이크 처리 할 수 있습니다.</p>
                <br />
                <br />
                <Link to={"/Editor"}>이미지,영상업로드</Link>
              </div>
              <div className="uploadimg">
                <img src="img/main_img01.png" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainBody;
