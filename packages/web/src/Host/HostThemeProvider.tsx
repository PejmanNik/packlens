import { ReactNode, useLayoutEffect, useState } from "react";
import { HostThemeContext } from "./HostThemeContext";
import { useHostApi } from "./useHostApi";

const vsCodeDark = "vscode-dark";
const vsCodeLight = "vscode-light";

export function HostThemeProvider({ children }: { children: ReactNode }) {
  const { isBrowserEnv } = useHostApi();
  const [value, setValue] = useState(() => getDefaultTheme(isBrowserEnv));

  useLayoutEffect(() => {
    if (isBrowserEnv) {
      return;
    }

    const listener = () => {
      setValue({ isDark: document.body.className.includes(vsCodeDark) });
    };

    const observer = new MutationObserver(listener);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [isBrowserEnv]);

  useLayoutEffect(() => {
    if (!isBrowserEnv) {
      return;
    }

    const listener = (event: MediaQueryListEvent) => {
      setValue({ isDark: event.matches });
      simulateVsCodeTheme(event.matches);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", listener);
    simulateVsCodeTheme(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [isBrowserEnv]);

  return (
    <HostThemeContext.Provider value={value}>
      {children}
    </HostThemeContext.Provider>
  );
}

function getDefaultTheme(isBrowserEnv: boolean) {
  if (isBrowserEnv) {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return { isDark };
  }

  return { isDark: document.body.className.includes(vsCodeDark) };
}

// Simulate vscode theme class for use in styles
function simulateVsCodeTheme(isDark: boolean) {
  if (isDark) {
    document.body.classList.remove(vsCodeLight);
    document.body.classList.add(vsCodeDark);
  } else {
    document.body.classList.remove(vsCodeDark);
    document.body.classList.add(vsCodeLight);
  }
}
