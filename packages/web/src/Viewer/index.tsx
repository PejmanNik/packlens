import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Response } from "@packlens/common";
import { useHostApi } from "../Host/useHostApi";
import { StateType } from "../Host/HostApiContext";
import { PageState } from "../Host/PageState";
import { clientPrefix } from "../Utils/logger";
import RowList from "./RowList";
import Searchbox from "./Searchbox";
import { PageLoader } from "./PageLoader";

const pageSize = 100;

const Container = styled.div`
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
`;

type ReaderState = Omit<StateType, "parserScript">;

const defaultHostState: StateType = {
  pageState: PageState.create(pageSize),
  totalEntities: 0,
  totalDecodedEntities: 0,
  isPageComplete: false,
  parserScript: "",
};

export default function Viewer() {
  const { hostApi, initRead, loadPage } = useHostApi();
  const loadingState = useRef<PageLoader>(new PageLoader(loadPage));

  const hostState = useMemo(
    () => hostApi.getState() ?? defaultHostState,
    [hostApi],
  );

  const [readerState, setReaderState] = useState<ReaderState>(hostState);
  const [parserScript, setParserScript] = useState<string>("");

  console.debug(clientPrefix, "state", readerState);

  // Sync vscode sate with the app
  useEffect(() => {
    const state = { ...readerState, parserScript };
    setTimeout(() => hostApi.setState(state));
  }, [hostApi, readerState, parserScript]);

  // Host message handler
  useEffect(() => {
    const callback = (event: MessageEvent<Response>) => {
      if (
        event.data.type != "init_read_response" &&
        event.data.type != "load_page_response"
      ) {
        return;
      }

      const body = event.data.body;
      console.debug(clientPrefix, "server response", body);

      if (body.ok == false) {
        console.error(clientPrefix, "error in server response", body.error);
        return;
      }

      if (event.data.type == "init_read_response") {
        setReaderState({
          totalEntities: body.value.totalEntities,
          totalDecodedEntities: body.value.totalDecodedEntities,
          isPageComplete: body.value.isPageComplete,
          pageState: PageState.create(
            pageSize,
            body.value.pageNumber,
            body.value.data,
            body.value.hasNextPage,
          ),
        });
      } else {
        setReaderState((prevState) => ({
          totalEntities: body.value.totalEntities,
          totalDecodedEntities: body.value.totalDecodedEntities,
          isPageComplete: body.value.isPageComplete,
          pageState: prevState.pageState.addPageData(
            body.value.pageNumber,
            body.value.data,
            body.value.hasNextPage,
          ),
        }));
      }

      // when filtering data with parserScript, the page may not be complete when
      // there are not enough entities to fill the page size.
      // so if has next page, load the next page automatically
      if (!body.value.isPageComplete && body.value.hasNextPage) {
        loadPage(body.value.pageNumber);
      } else {
        loadingState.current.resolveLoading(body.value.pageNumber);
      }
    };
    window.addEventListener("message", callback);
    loadingState.current.setEnabled();
    initRead(pageSize, parserScript);

    return () => window.removeEventListener("message", callback);
  }, [hostApi, initRead, loadPage, parserScript]);

  const loadData = (pageNumber: number) => {
    if (readerState.pageState.pages.includes(pageNumber)) {
      return;
    }

    loadingState.current.loadPage(pageNumber);
  };

  return (
    <Container>
      <Searchbox
        defaultValue={parserScript}
        onChange={(script) => setParserScript(script)}
        totalEntities={readerState.totalDecodedEntities}
      />
      {readerState.pageState.maxIndex > 0 && (
        <RowList
          pageState={readerState.pageState}
          totalEntities={readerState.totalEntities}
          loadData={loadData}
        />
      )}
    </Container>
  );
}
