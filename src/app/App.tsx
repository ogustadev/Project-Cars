import { BrowserRouter, Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/sections/Footer";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { Admin } from "./pages/Admin";
import { VehiclesProvider } from "./context/VehiclesContext";

function PublicSite() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colecao" element={<Catalog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <VehiclesProvider>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </VehiclesProvider>
    </BrowserRouter>
  );
}
