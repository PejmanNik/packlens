import { createContext } from "react";
import { WebviewApi } from "vscode-webview";
import { BrowserApi } from "./BrowserApi";
import { PageState } from "./PageState";

export type StateType = {
  pageState: PageState;
  totalEntities: number;
  totalDecodedEntities: number;
  parserScript: string;
  isPageComplete: boolean;
};

export type HostApiContextType =
  | { isBrowserEnv: false; hostApi: WebviewApi<StateType> }
  | { isBrowserEnv: true; hostApi: BrowserApi<StateType> };

export const HostApiContext = createContext<HostApiContextType>({
  isBrowserEnv: true,
  hostApi: new BrowserApi(),
});
