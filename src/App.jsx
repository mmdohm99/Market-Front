import { Route, Routes } from "react-router-dom";
import Seo from "./components/seo/Seo";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminBanners from "./pages/admin-view/banners";
import AdminCategories from "./pages/admin-view/categories";
import AdminBrands from "./pages/admin-view/brands";
import AdminTheme from "./pages/admin-view/theme";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { getThemePalette } from "./store/theme-slice";
import { applyThemePalette, getResolvedDarkMode } from "./lib/theme-palette";
import { Skeleton } from "@/components/ui/skeleton";
import PaymobReturnPage from "./pages/shopping-view/paymob-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );
  const { palette } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(getThemePalette());
  }, [dispatch]);

  useEffect(() => {
    applyThemePalette(palette, getResolvedDarkMode(palette));
  }, [palette]);

  useEffect(() => {
    const faviconHref = palette?.logo || "/default-logo.svg";
    let iconElement = document.querySelector("link[rel='icon']");
    if (!iconElement) {
      iconElement = document.createElement("link");
      iconElement.setAttribute("rel", "icon");
      document.head.appendChild(iconElement);
    }
    iconElement.setAttribute("href", faviconHref);

    let appleIconElement = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleIconElement) {
      appleIconElement = document.createElement("link");
      appleIconElement.setAttribute("rel", "apple-touch-icon");
      document.head.appendChild(appleIconElement);
    }
    appleIconElement.setAttribute("href", faviconHref);
  }, [palette?.logo]);

  if (isLoading) return <Skeleton className="w-[800] h-[600px] bg-muted" />;

  console.log(isLoading, user);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-transparent">
      <Seo />
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="theme" element={<AdminTheme />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paymob-return" element={<PaymobReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
