
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

// Import from lucide-react
import { ChevronLeft, ChevronRight } from "lucide-react";

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 inset-y-0 left-0 bg-background border-r border-border/50 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-semibold">
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
      </aside>

      {/* Main content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
      }`}>
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="container max-w-6xl py-6 px-4 sm:px-6"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
