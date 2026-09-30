import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddStudents from "../pages/AddStudents";
import UserLayout from "../layouts/UserLayout";

const RenderRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route path="/AddStudents" element={<AddStudents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RenderRoutes;
