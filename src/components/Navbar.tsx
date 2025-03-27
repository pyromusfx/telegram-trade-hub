
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Key, LineChart, Zap, Settings, CreditCard } from "lucide-react";

interface NavbarProps {
  collapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/api-keys", label: "API Keys", icon: <Key size={18} /> },
    { to: "/trades", label: "Trade History", icon: <LineChart size={18} /> },
    { to: "/signals", label: "Signals", icon: <Zap size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
    { to: "/subscription", label: "Subscription", icon: <CreditCard size={18} /> },
  ];

  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      <ul className="space-y-1 px-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''} ${
                  collapsed ? 'justify-center' : ''
                }`
              }
              end={item.to === "/"}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
