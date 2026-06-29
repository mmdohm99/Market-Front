import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  const isAuthRoute =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");
  const isAdminRoute = location.pathname.includes("/admin");
  const isShopRoute = location.pathname.includes("/shop");
  const isProtectedShopRoute =
    location.pathname.includes("/shop/checkout") ||
    location.pathname.includes("/shop/account") ||
    location.pathname.includes("/shop/paymob-return") ||
    location.pathname.includes("/shop/payment-success");

  if (location.pathname === "/") {
    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/shop/home" />;
  }

  if (!isAuthenticated && (isProtectedShopRoute || isAdminRoute)) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/shop/home" />;
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (!isAuthenticated && !isShopRoute && !isAuthRoute) {
    return <Navigate to="/shop/home" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
