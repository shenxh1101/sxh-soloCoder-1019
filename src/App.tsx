import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import Login from "@/pages/Login";
import DataCatalog from "@/pages/DataCatalog";
import ProductDetail from "@/pages/ProductDetail";
import ApplicationProcess from "@/pages/ApplicationProcess";
import AuthorizationManagement from "@/pages/AuthorizationManagement";
import TransactionRecords from "@/pages/TransactionRecords";
import ReviewCenter from "@/pages/ReviewCenter";
import AdminDashboard from "@/pages/AdminDashboard";
import { useAuthStore } from "@/store/authStore";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/catalog" replace />} />
          <Route path="catalog" element={<DataCatalog />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="applications" element={<ApplicationProcess />} />
          <Route path="authorizations" element={<AuthorizationManagement />} />
          <Route path="transactions" element={<TransactionRecords />} />
          <Route path="reviews" element={<ReviewCenter />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/review" element={<AdminDashboard />} />
          <Route path="admin/statistics" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
