import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "./components/ui/sidebar";
import Login from "./modules/login/screens/login";
import ForgotPassword from "./modules/login/screens/forgot-password";
import ResetPassword from "./modules/login/screens/reset-password";
import Home from "./modules/home/screens/home";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import BudgetScreen from "./modules/budgets/screens/budgets";
import OrderScreen from "./modules/orders/screens/order-screen";
import SchedulingScreen from "./modules/schedules/screens/schedules";
import ServicesScreen from "./modules/services/screens/services";
import ClientsScreen from "./modules/clients/screens/clients";
import VehiclesScreen from "./modules/vehicles/screens/vehicles";

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
  const withSidebar = location.pathname !== "/login" && 
                     location.pathname !== "/forgot-password" && 
                     location.pathname !== "/reset-password";

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
          ${withSidebar ? "ml-4 p-4" : "ml-4 p-4"}
        `}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <BudgetScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <SchedulingScreen />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServicesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <ClientsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <VehiclesScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* outras rotas */}
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
