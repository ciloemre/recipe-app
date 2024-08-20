import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const redirectIfNotAuthenticated = (
    message: string = "Bu işlem için giriş yapmalısınız."
  ) => {
    if (!user) {
      alert(message);
      navigate("/login");
      return true;
    }
    return false;
  };

  return { redirectIfNotAuthenticated };
};
