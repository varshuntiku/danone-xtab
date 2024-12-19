import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import GlobalStyleProvider from "./GlobalStyleProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <GlobalStyleProvider /> */}
    <span>Global Styles Provider</span>
  </StrictMode>
);
