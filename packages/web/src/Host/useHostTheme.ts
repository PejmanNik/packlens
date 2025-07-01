import { useContext } from "react";
import { HostThemeContext } from "./HostThemeContext";

export const useHostTheme = () => {
  return useContext(HostThemeContext);
};
