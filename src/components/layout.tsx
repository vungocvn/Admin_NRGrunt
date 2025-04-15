import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleToggle = (e: any) => {
      setIsCollapsed(e.detail);
    };
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  return (
    <div className="flex min-h-screen">
    <Sidebar /> {/* Sidebar tự chiếm w-20 hoặc w-64 */}
    <div className="flex-1 px-4 py-6 transition-all duration-300">
      {children}
    </div>
  </div>
  
  );
}
