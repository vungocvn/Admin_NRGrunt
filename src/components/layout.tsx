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
    <>
      <div className="flex min-h-screen gap-x-4">
        <div className={`${isCollapsed ? 'w-[70px]' : 'w-[240px]'} transition-all duration-300`}>
          <Sidebar />
        </div>

        <main className="flex-1 p-4 pt-0">
          {children}
        </main>
      </div>

     
    </>
  );
}

