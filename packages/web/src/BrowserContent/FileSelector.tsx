import "@vscode-elements/elements/dist/vscode-button";
import { useRef } from "react";
import { useNavigate } from "react-router";
import styled from "@emotion/styled";
import { useHostApi } from "../Host/useHostApi";
import icon from "./icon.svg";
import { routes } from "./routes";
import InstallVSCodeBadge from "./InstallVSCodeBadge";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  vscode-button {
    width: 35%;
    margin-block-end: 0.5rem;
    height: 2rem;
    display: flex;
  }
`;

const Logo = styled.img`
  width: 15rem;
`;

const Title = styled.h1`
  margin-bottom: 0;
  font-weight: 500;
`;

const Description = styled.h4`
  margin-top: 0;
  font-weight: 100;
  margin-block-end: 2em;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function FileSelector() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const api = useHostApi();

  if (!api.isBrowserEnv) {
    throw new Error("FileSelector should only be used in browser environment");
  }

  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    api.hostApi.setFile(event.target.files[0]);
    navigate(routes.view);
  };

  return (
    <Container>
      <Content>
        <Logo
          src={icon}
          aria-description="Packet lense message Icon"
          alt="Packet Lense Message Icon"
        />
        <Title>Message Pack Viewer</Title>
        <Description>
          Decode and search within a Message Pack encoded binary file offline
        </Description>
      </Content>
      <input
        ref={inputRef}
        type="file"
        onChange={selectFile}
        style={{ display: "none" }}
      />
      <vscode-button onClick={() => inputRef.current?.click()}>
        Select File
      </vscode-button>
      <InstallVSCodeBadge />
    </Container>
  );
}
