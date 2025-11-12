// src/components/ui/Sidebar.tsx
import {
  Home,
  ShoppingCart,
  ClipboardList,
  CalendarCheck,
  FileText,
  Users,
  Car,
  User as UserIcon,
  X,
  DoorOpen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { logout, isUserAdmin, isUserAdminSync } from "../../servicos/login-service";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  onLinkClick: () => void;
};

export default function Sidebar({ open, onClose, onLinkClick }: SidebarProps) {
  const navigate = useNavigate();
  const [userIsAdmin, setUserIsAdmin] = useState(isUserAdminSync());

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdmin = await isUserAdmin();
        setUserIsAdmin(isAdmin);
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setUserIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#F4F5FB] shadow-lg
        transform transition-transform duration-300 ease-in-out

        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:inset-auto
        flex flex-col gap-6 px-6 py-8
      `}
    >
      {/* Botão de fechar só no mobile */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden text-[#707FDD]"
      >
        <X size={28} />
      </button>

      {/* Logo */}
      <div className="flex justify-center mt-8">
        <img src={logo} alt="AutoFinance Logo" className="w-24 h-24" />
      </div>

      {/* Navegação */}
      <nav className="flex-1 flex flex-col">
        <p className="text-xs text-gray-500 mb-1">MENU</p>
        {[
          { to: "/home", icon: <Home size={18} />, label: "Início" },
          { to: "/budgets", icon: <ShoppingCart size={18} />, label: "Orçamentos" },
          { to: "/orders", icon: <ClipboardList size={18} />, label: "Ordem de Serviço" },
          { to: "/schedules", icon: <CalendarCheck size={18} />, label: "Agendamentos" },
          { to: "/services", icon: <FileText size={18} />, label: "Serviços" },
          { to: "/clients", icon: <Users size={18} />, label: "Clientes" },
          { to: "/vehicles", icon: <Car size={18} />, label: "Veículos" },
        ].map(({ to, icon, label }) => (
          <SidebarItem
            key={to}
            to={to}
            icon={icon}
            label={label}
            onClick={onLinkClick}
          />
        ))}

        <p className="text-xs text-gray-500 mt-6 mb-1">OUTROS</p>
        {[
          { to: "/users", icon: <UserIcon size={18} />, label: "Usuários", adminOnly: true }
        ].filter(item => !item.adminOnly || userIsAdmin).map(({ to, icon, label }) => (
          <SidebarItem
            key={to}
            to={to}
            icon={icon}
            label={label}
            onClick={onLinkClick}
          />
        ))}
        <button
          onClick={() => {
            logout(); // Remove o token
            navigate("/"); // Redireciona para a landing page
          }}
          className="flex items-center gap-3 py-2 px-2 rounded-md text-sm text-gray-700 hover:bg-[#e4e8f8] transition-all"
        >
          <span className="text-[#B7B8C9]">
            <DoorOpen size={18} />
          </span>
          <span className="font-medium">Sair</span>
        </button>
      </nav>
    </div>
  );
}

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

function SidebarItem({ to, icon, label, onClick }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2 px-2 rounded-md text-sm
         ${isActive ? "bg-[#e4e8f8] text-[#707FDD]" : "text-gray-700"}
         hover:bg-[#e4e8f8] transition-all`
      }
    >
      <span className="text-[#B7B8C9]">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
