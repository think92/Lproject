import React, { useEffect, useRef, useState } from "react";
import MainBar from "./MainBar";
import "./css/mainbar.css";
import "./css/mainbody.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faSliders,
  faShapes,
  faRobot,
  faUsersViewfinder,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faYoutube,
  faFacebookF,
  faLinkedinIn,
  faFacebookMessenger,
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";

// 섹션 스타일 정의
const Section = styled.div`
  transition: background-color 0.9s;
`;
const MainBody = () => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 추가
    return () => {
      window.removeEventListener("scroll", handleScroll); // 이벤트 제거
    };
  }, []);

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);
    const imagesPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("Image Data URL:", reader.result); // 데이터 URL 확인
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagesPromises)
      .then((images) => {
        console.log("All images:", images); // 이미지 배열 로깅
        if (images.length > 0) {
          navigate("/Editor", { state: { images: images } });
        } else {
          console.log("No images to navigate with.");
        }
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
  };

  const navigate = useNavigate();

  // 기본 섹션 설정
  const [currentSection, setCurrentSection] = useState(0);
  const sectionHeight = window.innerHeight; // 섹션 높이


  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const scrollY = window.scrollY; // 현재 스크롤 위치
    const newSection = Math.floor(scrollY / sectionHeight); // 현재 섹션 결정
    setCurrentSection(newSection); // 현재 섹션 설정

    const scrollFraction = scrollY % sectionHeight; // 섹션 내 스크롤 비율


    if (scrollFraction > sectionHeight * 0.2) {
      // 섹션 마지막 20%일 때 다음 섹션으로 전환
      setCurrentSection(newSection + 1);
    }
  };

  // 배경색 변경 함수
  const getBackgroundColor = (sectionIndex) => {
    switch (sectionIndex) {
      case 0:
        return "#292c31"; // 첫 번째 섹션의 배경색
      case 1:
        return "#d4fe75"; // 두 번재
      case 2:
        return "#A3A4A5"; // 세 번째
      default:
        return "#1A1C1E"; // 기본
    }
  };

  return (
    <div className="body">
      <MainBar />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
        multiple
      />
      <section style={{ backgroundColor: getBackgroundColor(currentSection) }}>
        <div id="upload">
          <div className="uploadbackground1">
            <div className="uploadbackground2">
              <div className="uploadtext">
                <h1>무료 온라인 모자이크 에디터</h1>
                <p>Blurbla(블러블라) 무료 온라인 모자이크 에디터로</p>
                <p>사진 및 동영상을 손쉽게 모자이크 처리 할 수 있습니다.</p>
                <br />
                <br />
                <button className="uploadtext" onClick={handleButtonClick}>
                  이미지/영상업로드
                </button>
              </div>

              <div className="uploadimg">
                <img src="img/main_img01.png" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1번째 소개 */}
      <Section
        className="intro01"
        style={{ backgroundColor: getBackgroundColor(currentSection) }}
      >
        <div id="intro1">
          <div className="intro1box">
            <div className="introtitle">
              <h1>
                Blurbla(블러블라)무료 모자이크
                <br />
                에디터로 빠르게 모자이크 처리
              </h1>
            </div>
            <div className="introbox">
              <div className="iconbox">
                <p>
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="loadicon1"
                  />
                </p>
              </div>
              <div className="introtext">
                <h3>즉시 업로드</h3>
                <p>
                  이미지를 편집기로 끌어다 놓기만 하면
                  <br />
                  바로 편집을 시작할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="introbox">
              <div className="iconbox">
                <p>
                  <FontAwesomeIcon icon={faShapes} className="loadicon2" />
                </p>
              </div>
              <div className="introtext">
                <h3>사진/영상 모자이크</h3>
                <p>
                  이미지, 영상을 원하는 부분을 선택하거나
                  <br />
                  AI기능을 사용해서 모자이크 처리 할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="introbox">
              <div className="iconbox">
                <p>
                  <FontAwesomeIcon icon={faSliders} className="loadicon3" />
                </p>
              </div>
              <div className="introtext">
                <h3>필터 및 조정</h3>
                <p>
                  모자이크를 다양한 농도와 모양을 선택하여
                  <br />
                  사용자가 원하는 결과를 만들 수 있습니다.
                </p>
              </div>
            </div>
          </div>
          <div className="intro2box">
            <div id="intro2">
              <img src="./img/main_img02.png" />
            </div>
          </div>
        </div>
      </Section>

      {/* 2번째 소개 */}
      <Section
        className="intro02"
        style={{ backgroundColor: getBackgroundColor(currentSection) }}
      >
        <div id="intro3">
          <div className="intro3box">
            <div id="intro3">
              <img src="./img/main_img04.png" />
            </div>
          </div>
          <div className="intro4box">
            <div className="introtitle2">
              <h1>
                AI를 활용해서 버튼 하나로
                <br />
                훤하는 부분 일괄 모자이크 처리
              </h1>
            </div>
            <div className="introbox2">
              <div className="iconbox2">
                <p>
                  <FontAwesomeIcon icon={faRobot} className="loadicon4" />
                </p>
              </div>
              <div className="introtext2">
                <h3>완벽한 모자이크 처리</h3>
                <p>
                  원하는 항목을 선택하면 AI가 완벽하게
                  <br />
                  모자이크 처리를 해드립니다.
                </p>
              </div>
            </div>

            <div className="introbox2">
              <div className="iconbox2">
                <p>
                  <FontAwesomeIcon
                    icon={faUsersViewfinder}
                    className="loadicon5"
                  />
                </p>
              </div>
              <div className="introtext2">
                <h3>여러 사진과 동영상도 한번에 처리</h3>
                <p>
                  클릭 한번으로 동영상과 여러 장의 사진도
                  <br />
                  일괄적으로 모자이크 처리가 가능합니다.
                </p>
              </div>
            </div>

            <div className="introbox2">
              <div className="iconbox2">
                <p>
                  <FontAwesomeIcon icon={faSliders} className="loadicon6" />
                </p>
              </div>
              <div className="introtext2">
                <h3>필터 및 조정</h3>
                <p>
                  모자이크를 다양한 농도와 모양을 선택하여
                  <br />
                  사용자가 원하는 결과를 만들 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>


      <Section style={{ backgroundColor: getBackgroundColor(currentSection) }}>
      <hr className="line"></hr>
        <div id="intro4">
          <div className="blurblaicon">
            <img src="./img/blurbla_simbol.png"></img>
          </div>
          <div className="snslingbody">
            <div className="snslink">
              <Link to={"/"}>
                <FontAwesomeIcon icon={faTwitter} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faFacebookF} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faYoutube} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon icon={faLinkedinIn} className="loadicon7" />
              </Link>
              <Link to={"/"}>
                <FontAwesomeIcon
                  icon={faFacebookMessenger}
                  className="loadicon7"
                />
              </Link>
            </div>
            <div className="adresslink">
              <p>© 2024 - Company, Inc. All rights reserved. Address Address</p>
            </div>
          </div>
          <div className="footeradress">
            <p>상호 : (주)블러블라 l 대표자명 : 임경남</p>
            <p>사업자등록번호 : 000-00-00000  l 연락처 : 00-000-0000</p>
            <p>주소 : 광주광역시 남구 송암로 60 광주CGI센터</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default MainBody;
