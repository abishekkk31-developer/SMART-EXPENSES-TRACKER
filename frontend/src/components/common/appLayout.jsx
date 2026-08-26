import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#090b10] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}