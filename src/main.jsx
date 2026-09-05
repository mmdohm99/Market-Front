import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";
import { initTheme } from "./lib/theme";
import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";

initTheme();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 15, behavior: "smooth" });
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  </HelmetProvider>
);