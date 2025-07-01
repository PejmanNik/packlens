import "@vscode-elements/elements/dist/vscode-icon";
import styled from "@emotion/styled";

const Container = styled.a`
  position: absolute;
  bottom: 2px;
  font-size: 0.7rem;
  color: var(--vscode-textLink-foreground);
`;

export default function InstallVSCodeBadge() {
  return (
    <Container
      href="https://marketplace.visualstudio.com/items?itemName=pejmannikram.packlens"
      target="_blank"
      rel="noopener noreferrer"
    >
      Add PackLens to VSCode
    </Container>
  );
}
