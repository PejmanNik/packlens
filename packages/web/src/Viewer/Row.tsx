import JsonView from "react18-json-view";
import { DataType } from "@packlens/common";
import { useHostTheme } from "../Host/useHostTheme";

export interface RowProps {
  data: DataType;
}

export default function Row({ data }: RowProps) {
  const theme = useHostTheme();
  return (
    <JsonView
      src={data}
      collapsed={5}
      displayArrayIndex
      displaySize
      theme="default"
      dark={theme.isDark}
    ></JsonView>
  );
}
