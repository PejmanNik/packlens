import { MemoryRouter, Route, Routes } from "react-router";
import Viewer from "../Viewer";
import FileSelector from "./FileSelector";
import { routes } from "./routes";
import "./theme.css";

export default function BrowserContent() {
  return (
    <MemoryRouter>
      <Routes>
        <Route index element={<FileSelector />} />
        <Route path={routes.view} element={<Viewer />} />
      </Routes>
    </MemoryRouter>
  );
}
