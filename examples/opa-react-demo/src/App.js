import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <GeistProvider>
      <CssBaseline />
      <Outlet />
    </GeistProvider>
  );
}
