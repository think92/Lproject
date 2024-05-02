import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/Editor.css";
import MainBar from "./MainBar";
import {
  faCar,
  faFaceSmile,
  faPhone,
  faSmoking,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const Editor = () => {
  const fileInputRef = useRef(null);
  const [imageView, setImageView] = useState(null);
  const [images, setImages] = useState([]);
  const [intensityAuto, setIntensityAuto] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const location = useLocation();
  console.log(location.state);

  useEffect(() => {
    console.log("Location state on editor load:", location.state);
    if (location.state?.images) {
      setImages(location.state.images);
      setImageView(location.state.images[0]);
    } else {
      console.error("No images passed in state.");
    }
    
  }, [location]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("Image Data URL:", reader.result);
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(
      (newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages]);
        if (newImages.length > 0) {
          setImageView(newImages[0]);
        }
      },
      (error) => {
        console.error("Error loading images : ", error);
      }
    );
  };

  const selectImage = (event, image) => {
    event.stopPropagation(); // 이벤트 전파 중지
    setImageView(image); // 선택된 이미지를 대표 이미지로 설정
  };

  const handleRemoveImage = (event, index) => {
    event.stopPropagation(); // 이벤트 전파 중지
    setImages((prevImages) => {
      const filteredImages = prevImages.filter((_, idx) => idx !== index);
      if (index === 0 && filteredImages.length > 0) {
        setImageView(filteredImages[0]); // 첫 번째 이미지가 삭제되면 새 첫 번째 이미지를 대표 이미지로 설정
      } else if (filteredImages.length === 0) {
        setImageView(null); // 모든 이미지가 삭제되면 대표 이미지 제거
      }
      return filteredImages;
    });
  };

  return (
    <div className="editor-specific">
      <MainBar />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
        multiple
      />
      <section className="sec">
        <div className="buttons">
          <p className="auto">Auto Mosaic</p>
          <div className="li">
            <div className="types">
              <p>타입</p>
              <button className="type">
                <FontAwesomeIcon icon={faFaceSmile} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faCar} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faPhone} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faSmoking} />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensityAuto}
                onChange={(e) => setIntensityAuto(e.target.value)}
                className="slider"
              />
              <p>{intensityAuto}%</p>
            </div>
            <div className="types">
              <p>모양</p>
              <button className="type">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="type">■</button>
              <button className="type">■</button>
              <button className="type">■</button>
            </div>
            <div className="types">
              <p>모자이크 해제 대상</p>
              <button className="type">■</button>
            </div>
          </div>
          <p className="auto">User Mosaic</p>
          <div className="li">
            <div className="types">
              <p>모자이크 해제 대상</p>
              <button className="type">■</button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="slider"
              />
              <p>{intensity}%</p>
            </div>
            <div className="types">
              <p>모양</p>
              <button className="type">■</button>
              <button className="type">■</button>
              <button className="type">■</button>
              <button className="type">■</button>
            </div>
          </div>
          <div className="submits">
            <button onClick={handleButtonClick} className="submit active">
              사진/영상 업로드
            </button>
            <button className="submit">저장</button>
            <button className="submit">삭제</button>
          </div>
        </div>
        <div className="edit">
          {imageView ? (
            <img className="imgEdit" src={imageView} alt="Selected" />
          ) : (
            <p>이미지를 선택하세요</p>
          )}
        </div>
        <div className="imgSaves">
          {images.map((image, index) => (
            <div
              key={index}
              className="imgsave"
              onClick={(event) => selectImage(event, image)}
            >
              <img src={image} alt={`이미지 ${index + 1}`}></img>
              <div
                className="delete-icon"
                onClick={(event) => handleRemoveImage(event, index)}
              >
                X
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Editor;
