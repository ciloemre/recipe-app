import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { DirectionProvider, MantineProvider } from "@mantine/core";
import { theme } from "./theme/theme.tsx";
import Layout from "./components/layout/layout.tsx";
import HomePage from "./pages/HomePage";
import CreateRecipePage from "./pages/CreateRecipePage.tsx";
import FavoriteRecipesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";
import RecipePage from "./pages/RecipePage.tsx";
import SplashScreen from "./pages/SplashScreen";
import LogoutPage from "./pages/LogoutPage.tsx";
import { ProtectedRoute } from "./components/recipe/ProtectedRoute";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { getStoredLocale } from "./i18n";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

const App: React.FC = () => {
  const [initialDir] = useState<"ltr" | "rtl">(() =>
    getStoredLocale() === "ar" ? "rtl" : "ltr"
  );

  return (
    <DirectionProvider initialDirection={initialDir}>
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>
          <AuthProvider>
            <RecipeProvider>
              <Router>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    element={
                      <Layout>
                        <Outlet />
                      </Layout>
                    }
                  >
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/recipes" element={<RecipePage />} />
                    <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <FavoriteRecipesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create"
                      element={
                        <ProtectedRoute>
                          <CreateRecipePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-recipe"
                      element={
                        <ProtectedRoute>
                          <CreateRecipePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/recipe-form"
                      element={
                        <ProtectedRoute>
                          <CreateRecipePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/logout" element={<LogoutPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </Router>
            </RecipeProvider>
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </DirectionProvider>
  );
};

export default App;
