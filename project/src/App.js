import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainBody from "./MainBody";
import Editor from "./Editor";
import Login from "./Login";
import Join from "./Join";
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainBody />} />
          <Route path="/Editor" element={<Editor />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Join" element={<Join />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
