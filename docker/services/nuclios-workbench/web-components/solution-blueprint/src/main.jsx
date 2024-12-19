import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SolutionBluePrint from "./components/SolutionBluePrint";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SolutionBluePrint />
    {/* <span>Solution Blueprint</span> */}
  </StrictMode>
);
