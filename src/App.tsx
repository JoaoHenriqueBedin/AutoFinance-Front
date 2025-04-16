import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "./components/ui/sidebar";
import Login from "./modules/login/screens/login";
import Home from "./modules/home/screens/home";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const withSidebar = location.pathname !== "/login";

  return (
    <div className="flex">
      {withSidebar && (
        <>
          {/* Botão “hambúrguer” only mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-4 md:hidden fixed top-0 left-0 z-50 text-[#707FDD]"
          >
            <Menu size={28} />
          </button>

          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLinkClick={() => setSidebarOpen(false)}
          />
        </>
      )}

      <div
        className={`
          flex-1 min-h-screen bg-white transition-margin duration-300
          ${withSidebar ? "md:ml-72" : ""}
        `}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* outras rotas */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
