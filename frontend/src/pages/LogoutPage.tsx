import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return <div>Çıkış yapılıyor...</div>;
};

export default LogoutPage;
