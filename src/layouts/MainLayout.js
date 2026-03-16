import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div
        style={{
          flex: 1,
          padding: 20,
          background: "#f1f3f5",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;