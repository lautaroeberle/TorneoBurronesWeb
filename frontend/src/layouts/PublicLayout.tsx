// src/layouts/PublicLayout.tsx
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
