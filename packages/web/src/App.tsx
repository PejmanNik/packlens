import React from "react";
import { useHostApi } from "./Host/useHostApi";
import BrowserContent from "./BrowserContent";
import Viewer from "./Viewer";
import { HostApiProvider } from "./Host/HostApiProvider";
import { HostThemeProvider } from "./Host/HostThemeProvider";
import "./index.css";

const App: React.FC = () => {
  return (
    <HostApiProvider>
      <HostThemeProvider>
        <Content />
      </HostThemeProvider>
    </HostApiProvider>
  );
};

function Content() {
  const { isBrowserEnv } = useHostApi();
  return isBrowserEnv ? <BrowserContent /> : <Viewer />;
}

export default App;
