import React from "react";
import ReactDOM from "react-dom/client";
import "./mainbar.css";
import "./mainbody.css";
// import App from './App';
import MainBar from "./MainBar";
import MainBody from "./MainBody";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <MainBar />
  <MainBody />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
