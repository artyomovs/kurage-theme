import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PartnerImages from "./pages/PartnerImages.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/partner-images" element={<PartnerImages />} />
    </Routes>
  );
}
