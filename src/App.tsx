import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CustomerMenuPage from "./pages/CustomerMenuPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import CustomerOrderPage from "./pages/CustomerOrderPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import AdminOrderHistoryPage from "./pages/AdminOrderHistoryPage";
import AdminQrCodePage from "./pages/AdminQrCodePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Routes>
      {/* Public customer routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/menu" element={<CustomerMenuPage />} />
      <Route path="/menu/:id" element={<ItemDetailsPage />} />
      <Route path="/order" element={<CustomerOrderPage />} />
      <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

      {/* Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Staff — protected */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRole="staff">
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Admin — protected */}
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminMenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminOrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/qr"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminQrCodePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;