import Navbar from "./navbar";
import Sidebar from "./sidebar";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;