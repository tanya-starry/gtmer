import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AdminPasswordModal } from "./components/AdminPasswordModal";
import { Dashboard } from "./pages/Dashboard";
import { useAdminMode } from "./hooks/useAdminMode";

function App() {
  const {
    isAdmin,
    showPasswordModal,
    passwordError,
    verifyPassword,
    logout,
    openPasswordModal,
    closePasswordModal,
  } = useAdminMode();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar isAdmin={isAdmin} onLogout={logout} />
      <main className="pt-[72px]">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                isAdmin={isAdmin}
                onTriggerPassword={openPasswordModal}
              />
            }
          />
        </Routes>
      </main>

      {/* Admin Password Modal */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        error={passwordError}
        onVerify={verifyPassword}
        onClose={closePasswordModal}
      />
    </div>
  );
}

export default App;
