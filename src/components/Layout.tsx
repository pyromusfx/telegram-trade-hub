
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Import from lucide-react
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  useEffect(() => {
    // Wait for component to hydrate
    setIsMounted(true);
    
    // Check if it's mobile view and collapse sidebar if needed
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar toggle for mobile
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Theme toggle
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      {/* Mobile header with toggle */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border/50 bg-background sticky top-0 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-secondary"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <h1 className="text-base font-semibold">
          <span className="text-primary">Crypto</span> Signals
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-secondary"
        >
          {isMounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 inset-y-0 left-0 bg-background border-r border-border/50 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-16 -translate-x-full md:translate-x-0" : "w-64"
        } ${sidebarCollapsed ? "md:w-16" : "md:w-64"} ${
          sidebarCollapsed && window.innerWidth < 768 ? "invisible md:visible" : "visible"
        }`}
        style={{ top: window.innerWidth < 768 ? "3.5rem" : "0" }}
      >
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between h-14 px-4 border-b border-border/50">
          {!sidebarCollapsed && (
            <h1 className="text-base font-semibold">
              <span className="text-primary">Crypto</span> Signals
            </h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-secondary"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <Navbar collapsed={sidebarCollapsed} />

        {!sidebarCollapsed && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="rounded-lg bg-secondary/50 p-3 text-xs">
              <p className="text-muted-foreground">Subscription Status</p>
              <p className="font-medium flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-signal-success"></span>
                Premium Active
              </p>
              <p className="text-xs text-muted-foreground mt-1">Expires in 60 days</p>
            </div>
          </div>
        )}
        
        {/* Desktop theme toggle */}
        <div className="hidden md:flex items-center justify-center py-3 border-t border-border/50">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-secondary"
            title={isMounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isMounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {!sidebarCollapsed && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 pt-0 md:pt-0 ${
        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
      }`}>
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="container max-w-6xl py-4 md:py-6 px-4 sm:px-6"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
