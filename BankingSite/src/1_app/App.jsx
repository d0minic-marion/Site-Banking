import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router.jsx";
import { AuthProvider } from "../3_context/AuthContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}