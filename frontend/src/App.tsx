import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/theme";
import Layout from "./components/layout/layout.tsx";
import HomePage from "./pages/HomePage";
import CreateRecipePage from "./pages/CreateRecipePage.tsx";
import FavoriteRecipesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.tsx";
// import SettingsPage from "./pages/SettingsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";
import RecipePage from "./pages/RecipePage.tsx";
import SplashScreen from "./pages/SplashScreen";
import LogoutPage from "./pages/LogoutPage.tsx";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RecipeProvider>
        <MantineProvider theme={theme}>
          <Notifications />
          <ModalsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<SplashScreen />} />{" "}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/home" element={<HomePage />} />{" "}
                  <Route path="/recipes" element={<RecipePage />} />
                  <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                  <Route path="/favorites" element={<FavoriteRecipesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/create" element={<CreateRecipePage />} />
                  <Route path="/create-recipe" element={<CreateRecipePage />} />
                  <Route path="/recipe-form" element={<CreateRecipePage />} />
                  {/* <Route path="/settings" element={<SettingsPage />} /> */}
                  <Route path="/logout" element={<LogoutPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />{" "}
              </Routes>
            </Router>
          </ModalsProvider>
        </MantineProvider>
      </RecipeProvider>
    </AuthProvider>
  );
};

export default App;
