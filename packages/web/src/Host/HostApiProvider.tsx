import { ReactNode, useMemo } from "react";
import { HostApiContextType, HostApiContext } from "./HostApiContext";
import { BrowserApi } from "./BrowserApi";

export function HostApiProvider({ children }: { children: ReactNode }) {
  const value = useMemo<HostApiContextType>(
    () =>
      typeof acquireVsCodeApi !== "undefined"
        ? { isBrowserEnv: false, hostApi: acquireVsCodeApi() }
        : { isBrowserEnv: true, hostApi: new BrowserApi() },
    [],
  );

  return (
    <HostApiContext.Provider value={value}>{children}</HostApiContext.Provider>
  );
}
