export const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null;
};
