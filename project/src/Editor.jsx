import "./css/Editor.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainBar from "./MainBar";
import {
  faCar,
  faFaceSmile,
  faPhone,
  faSmoking,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare, faCircle } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";

const Editor = () => {
  const fileInputRef = useRef(null);
  const [imageView, setImageView] = useState(null);
  const [images, setImages] = useState([]);
  const [intensityAuto, setIntensityAuto] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const location = useLocation();
  // console.log(location.state);

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
    setSelectedAreas([]); // 이미지 변경 시 선택된 영역 초기화
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

  ///////////////////////////////////////////////모자이크
  const canvasRef = useRef(null);

  const [selectedAreas, setSelectedAreas] = useState([]); // 선택된 영역
  const [dragStart, setDragStart] = useState(null);
  const [dragging, setDragging] = useState(false);

  // 드래그 이벤트 핸들러
  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setDragStart({ x: startX, y: startY });
    setDragging(true);
    // 초기화를 배열로 수정
    // setSelectedAreas([{ x: startX, y: startY, width: 0, height: 0 }]);
  }

  function handleMouseMove(e) {
    if (!dragging || !dragStart) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.rect(dragStart.x, dragStart.y, endX - dragStart.x, endY - dragStart.y);
    ctx.stroke();
    // 이 부분은 업데이트 하지 않습니다
  }

  function handleMouseUp(e) {
    if (!dragging || !dragStart) {
      setDragging(false);
      return;
    }
    setDragging(false);
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (endX !== dragStart.x || endY !== dragStart.y) {
      const mosaicResult = applyMosaic(
        dragStart.x,
        dragStart.y,
        endX - dragStart.x,
        endY - dragStart.y,
        intensity
      );
      if (mosaicResult) {
        const newArea = {
          x: dragStart.x,
          y: dragStart.y,
          width: endX - dragStart.x,
          height: endY - dragStart.y,
          mosaicImage: mosaicResult,
          intensity: intensity,
        };

        setSelectedAreas((prevAreas) => {
          const updatedAreas = [...prevAreas, newArea];
          console.log("Updated areas:", updatedAreas); // 업데이트된 배열 로그 출력
          return updatedAreas;
        });
        const updatedImages = images.map((img) =>
          img === imageView ? mosaicResult.mosaicImage : img
        );
        setImages(updatedImages);
        setImageView(mosaicResult.mosaicImage);
      }
    }
  }

  function applyMosaic(x, y, width, height, intensity) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 기존 이미지를 다시 로드하고 모자이크 적용
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      // 농도에 따라 픽셀 크기 조절
      const pixelSize = Math.max(1, Math.ceil((intensity / 100) * 30));

      for (let i = 0; i < width; i += pixelSize) {
        for (let j = 0; j < height; j += pixelSize) {
          averageColor(ctx, x + i, y + j, pixelSize);
        }
      }

      // 변경된 캔버스를 이미지 뷰에 반영
      const dataUrl = canvas.toDataURL("image/png");
      return {
        mosaicImage: dataUrl,
        pixelSize: pixelSize,
      };
    } else {
      console.error("imgRef.current is not set");
      return null;
    }
  }

  function averageColor(ctx, x, y, size) {
    const imageData = ctx.getImageData(x, y, size, size);
    let r = 0,
      g = 0,
      b = 0,
      a = 0,
      count = 0;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i * size + j) * 4;
        r += imageData.data[index];
        g += imageData.data[index + 1];
        b += imageData.data[index + 2];
        a += imageData.data[index + 3];
        count++;
      }
    }

    r /= count;
    g /= count;
    b /= count;
    a /= count;

    const averageColor = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(
      b
    )}, ${(a / 255).toFixed(2)})`;
    ctx.fillStyle = averageColor;
    ctx.fillRect(x, y, size, size);
  }
  const [activeArea, setActiveArea] = useState(null);

  // 이미지 레퍼런스 저장
  const imageRef = useRef(null);
  useEffect(() => {
    if (!imageView) return; // 이미지가 설정되지 않았다면 함수 종료

    // selectedAreas.forEach((el) => console.log(el));
    const image = new Image();
    image.src = imageView;
    image.onload = () => {
      imageRef.current = image; //이미지가 로드되면 참조를 설정

      const canvas = canvasRef.current;

      if (!canvas) return; // 캔버스 참조가 없다면 함수 종료

      const ctx = canvas.getContext("2d");
      canvas.width = image.width; // 캔버스 너비를 이미지 너비로 설정
      canvas.height = image.height; // 캔버스 높이를 이미지 높이로 설정

      ctx.drawImage(image, 0, 0, image.width, image.height); // 이미지를 캔버스에 그림
      // imageRef.current = image; // 이미지 참조를 저장

      // 모든 선택된 영역을 다시 그립니다.
      selectedAreas.forEach((area) => {
        if (area === activeArea) {
          ctx.setLineDash([]); // 점선 없애기
          ctx.strokeStyle = "red"; // 선 색상 변경
          ctx.lineWidth = 4; // 선 두께 증가
        } else {
          ctx.setLineDash([5, 3]); // 점선 스타일 설정
          ctx.strokeStyle = "#000"; // 기본 선 색상
          ctx.lineWidth = 1; // 기본 선 두께
        }
        ctx.strokeRect(area.x, area.y, area.width, area.height);
      });
    };
  }, [imageView, selectedAreas, activeArea]);

  const handleIntensityChange = (e) => {
    const newIntensity = parseInt(e.target.value);
    console.log("Slider Changed to", newIntensity);
    setIntensity(newIntensity);

    // 이미 선택된 영역이 있을 경우, 즉시 모자이크를 다시 적용
    if (selectedAreas && selectedAreas.width > 0 && selectedAreas.height > 0) {
      applyMosaic(
        selectedAreas.x,
        selectedAreas.y,
        selectedAreas.width,
        selectedAreas.height,
        intensity
      );
    }
  };

  ////////////////// 캔버스에 클릭 이벤트 추가

  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 현재 클릭된 영역 찾기
    const clickedArea = selectedAreas.find(
      (area) =>
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
    );

    // 활성 영역 업데이트 (선택된 영역이 없으면 null)
    setActiveArea(clickedArea);

    // 캔버스 다시 그리기
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // 모든 영역 다시 그리기
    selectedAreas.forEach((area) => {
      if (area === clickedArea) {
        // 활성 영역 강조
        ctx.setLineDash([]); // 점선 없애기
        ctx.strokeStyle = "red"; // 선 색상 변경
        ctx.lineWidth = 4; // 선 두께 증가
      } else {
        // 기본 스타일로 다시 그리기
        ctx.setLineDash([5, 3]); // 점선 스타일 설정
        ctx.strokeStyle = "#000"; // 기본 선 색상
        ctx.lineWidth = 1; // 기본 선 두께
      }
      ctx.strokeRect(area.x, area.y, area.width, area.height);
    });
  }

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
            <div className="types1">
              <p>모양</p>
              <button className="typeshape">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="typeshape">
                <FontAwesomeIcon icon={faCircle} />
              </button>
            </div>
            <div className="types2">
              <p>모자이크 해제 대상</p>
              <button className="typeclear">
                <FontAwesomeIcon icon={faVectorSquare} />
              </button>
            </div>
          </div>
          <p className="auto">User Mosaic</p>
          <div className="li2">
            <div className="types2">
              <p>모자이크 대상 선택</p>
              <button className="typeclear">
                <FontAwesomeIcon icon={faVectorSquare} />
              </button>
            </div>
            <div className="types">
              <p>농도</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={handleIntensityChange}
                className="slider"
              />
              <p>{intensity}%</p>
            </div>
            <div className="types1">
              <p>모양</p>
              <button className="typeshape">
                <FontAwesomeIcon icon={faSquare} />
              </button>
              <button className="type">
                <FontAwesomeIcon icon={faCircle} />
              </button>
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
            <>
              <canvas
                ref={canvasRef}
                className="imgEdit"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleCanvasClick}
              />
            </>
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
