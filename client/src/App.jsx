import AuthInitializer from "./components/auth/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthInitializer />
      <AppRoutes />
    </>
  );
}

export default App;