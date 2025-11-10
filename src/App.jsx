import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthApp from "./pages/Signup";
import FashionWebApp from "./pages/Home";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthApp />} />
        <Route path="/home" element={<FashionWebApp />} />
        <Route path="/Signup" element={<AuthApp />} />
      </Routes>
    </BrowserRouter>
  );
}
