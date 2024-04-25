import React from "react";
import Editor from "./Editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faFaceSmile,
  faPhone,
  faSmoking,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

const editor = () => {
  return (
    <section>
      <div class="buttons">
        <p class="auto">Auto Mosaic</p>
        <div class="li">
          <div class="types">
            <p>타입</p>
            <button class="type">
              <FontAwesomeIcon icon={faFaceSmile} />
            </button>
            <button class="type">
              <FontAwesomeIcon icon={faCar} />
            </button>
            <button class="type">
              <FontAwesomeIcon icon={faPhone} />
            </button>
            <button class="type">
              <FontAwesomeIcon icon={faSmoking} />
            </button>
          </div>
          <div class="types">
            <p>농도</p>
            <p>■■■■■■■■</p>
            <p>50%</p>
          </div>
          <div class="types">
            <p>모양</p>
            <button class="type">
              <FontAwesomeIcon icon={faSquare} />
            </button>
            <button class="type">■</button>
            <button class="type">■</button>
            <button class="type">■</button>
          </div>
          <div class="types">
            <p>모자이크 해제 대상</p>
            <button class="type">■</button>
          </div>
        </div>
        <p class="auto">User Mosaic</p>
        <div class="li">
          <div class="types">
            <p>모자이크 해제 대상</p>
            <button class="type">■</button>
          </div>
          <div class="types">
            <p>농도</p>
            <p>■■■■■■■■</p>
            <p>50%</p>
          </div>
          <div class="types">
            <p>모양</p>
            <button class="type">■</button>
            <button class="type">■</button>
            <button class="type">■</button>
            <button class="type">■</button>
          </div>
        </div>
        <div class="submits">
          <button class="submit active">사진/영상 업로드</button>
          <button class="submit">저장</button>
          <button class="submit">삭제</button>
        </div>
      </div>
      <div class="edit">
        <p>이미지</p>
      </div>
    </section>
  );
};

export default editor;
