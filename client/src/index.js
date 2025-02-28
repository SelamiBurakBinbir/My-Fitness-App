/************************************************************
 * client/src/index.js
 ************************************************************/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // <-- Global stil

import { BrowserRouter } from "react-router-dom";

import "./index.css"; // Varsa global CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
