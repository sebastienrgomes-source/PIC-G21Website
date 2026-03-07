import React from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./control/auth/AuthContext";
import ProtectedRoute from "./control/auth/ProtectedRoute";
import DashboardPage from "./control/pages/DashboardPage";
import DevicePage from "./control/pages/DevicePage";
import LoginPage from "./control/pages/LoginPage";
import RegisterPage from "./control/pages/RegisterPage";
import { LanguageProvider } from "./marketing/context/LanguageContext";
import MarketingPage from "./marketing/pages/MarketingPage";

function PublicAuthRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const [searchParams] = useSearchParams();

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    const next = searchParams.get("next") ?? "/control";
    return <Navigate replace to={next} />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/challenge" element={<MarketingPage sectionId="desafio" />} />
      <Route path="/solution" element={<MarketingPage sectionId="solucao" />} />
      <Route path="/technology" element={<MarketingPage sectionId="tecnologia" />} />
      <Route path="/applications" element={<MarketingPage sectionId="aplicacoes" />} />
      <Route path="/prototype" element={<MarketingPage sectionId="prototipo" />} />
      <Route path="/roadmap" element={<MarketingPage sectionId="roadmap" />} />
      <Route path="/team" element={<MarketingPage sectionId="equipa" />} />
      <Route path="/contact" element={<MarketingPage sectionId="contacto" />} />

      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <LoginPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthRoute>
            <RegisterPage />
          </PublicAuthRoute>
        }
      />

      <Route
        path="/control"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/control/device/:id"
        element={
          <ProtectedRoute>
            <DevicePage />
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard" element={<Navigate replace to="/control" />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}
