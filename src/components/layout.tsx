import { ReactNode } from 'react';
import Sidebar from './sidebar';

interface LayoutProps {
  children: ReactNode; // Nội dung trang sẽ được hiển thị tại đây
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
