import {
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UserCog,
  Search,
  X,
  Moon,
  Sun,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent } from "../ui/sheet";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  shoppingViewHeaderMenuItems,
  siteAnnouncement,
  socialLinks,
} from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { getActiveCategories } from "@/store/admin/category-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { toggleDarkMode } from "@/lib/theme";

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.4a8.28 8.28 0 005.58 2.18V12.1a4.85 4.85 0 01-3.77-1.73 4.83 4.83 0 01-1.23-3.68z" />
    </svg>
  );
}

const socialIconMap = {
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  tiktok: TikTokIcon,
};

function useNavMenuItems() {
  const dispatch = useDispatch();
  const { activeCategoryList } = useSelector((state) => state.adminCategory);

  useEffect(() => {
    dispatch(getActiveCategories());
  }, [dispatch]);

  return useMemo(() => {
    const staticItems = shoppingViewHeaderMenuItems.filter(
      (item) =>
        item.id === "home" || item.id === "products" || item.id === "search",
    );

    const categoryItems = activeCategoryList.slice(0, 5).map((category) => ({
      id: category.slug,
      label: category.name,
      path: "/shop/listing",
    }));

    const productsIndex = staticItems.findIndex(
      (item) => item.id === "products",
    );
    const searchIndex = staticItems.findIndex((item) => item.id === "search");

    return [
      ...staticItems.slice(0, productsIndex + 1),
      ...categoryItems,
      ...staticItems.slice(searchIndex),
    ].filter((item) => item.id !== "search");
  }, [activeCategoryList]);
}

function useCartSummary() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const items =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items
      : [];

  const total =
    items.length > 0
      ? items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) * currentItem?.quantity,
          0,
        )
      : 0;

  return { count: items.length, total, items };
}



function AnnouncementBar() {
  const [closing, setClosing] = useState(false);

  return (
    <div
      className={`overflow-hidden bg-orange-500 transition-all duration-300 ${
        closing ? "max-h-0 opacity-0 py-0" : "max-h-20 opacity-100 py-2.5"
      }`}
    >
      <div className="relative flex items-center justify-center px-10 text-center text-sm text-white">
        <p>{siteAnnouncement.text}</p>

        <button
          type="button"
          onClick={() => setClosing(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/80 hover:text-white"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SiteLogo({ className = "" }) {
  return (
    <Link
      to="/shop/home"
      className={`flex shrink-0 items-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary p-1.5">
        <img
          src="/default-logo.svg"
          alt="Nodum Gallery"
          className="h-full w-full object-contain"
        />
      </div>
    </Link>
  );
}

function DarkModeToggle({ className = "", showLabel = false }) {
  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.classList.contains("dark"),
  );

  function handleToggle() {
    setIsDarkMode(toggleDarkMode());
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {showLabel && <span>{isDarkMode ? "Light" : "Dark"}</span>}
    </button>
  );
}

function SocialLinks({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map((link) => {
        const Icon = socialIconMap[link.id];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-orange-400 hover:text-orange-500"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  className = "",
  inputRef,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={`relative w-full ${className}`}
    >
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="glass-input h-11 rounded-full pl-11 pr-4 text-sm focus-visible:ring-orange-400"
      />
    </form>
  );
}

function HeaderCartButton({ openCartSheet, setOpenCartSheet, showAmount = false }) {
  const { count, total, items } = useCartSummary();

  return (
    <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
      <button
        type="button"
        onClick={() => setOpenCartSheet(true)}
        className="relative flex items-center gap-2 text-sm text-foreground hover:text-foreground/80"
      >
        <ShoppingCart className="h-5 w-5" />
        {showAmount && <span className="font-medium">{total} EGP</span>}
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      </button>
      <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={items}
      />
    </Sheet>
  );
}

function HeaderAuthActions({
  openCartSheet,
  setOpenCartSheet,
  showCartAmount = false,
  onMenuClose,
}) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      dispatch(fetchCartItems());
    });
  }

  function goToLogin() {
    onMenuClose?.();
    navigate("/auth/login");
  }

  if (isAuthenticated) {
    return (
      <div className="flex  items-center gap-8">
        <HeaderCartButton
          openCartSheet={openCartSheet}
          setOpenCartSheet={setOpenCartSheet}
          showAmount={showCartAmount}
        />
        <DarkModeToggle showLabel />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer bg-orange-500">
              <AvatarFallback className="bg-orange-500 font-bold text-white">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onMenuClose?.();
                navigate("/shop/account");
              }}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={goToLogin}
        className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80"
      >
        <User className="h-4 w-4" />
        <span>Login</span>
      </button>
      <HeaderCartButton
        openCartSheet={openCartSheet}
        setOpenCartSheet={setOpenCartSheet}
        showAmount={showCartAmount}
      />
      <DarkModeToggle showLabel />
    </div>
  );
}

function NavLinks({
  menuItems,
  onNavigate,
  orientation = "horizontal",
  onItemClick,
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  function isActive(menuItem) {
    if (menuItem.id === "home") {
      return location.pathname === "/shop/home";
    }
    if (menuItem.id === "products") {
      return (
        location.pathname === "/shop/listing" && !searchParams.get("category")
      );
    }
    if (searchParams.get("category") === menuItem.id) {
      return true;
    }
    return false;
  }

  return (
    <nav
      className={
        orientation === "horizontal"
          ? "flex flex-wrap items-center gap-6"
          : "flex flex-col gap-5"
      }
    >
      {menuItems.map((menuItem) => {
        const active = isActive(menuItem);
        return (
          <button
            key={menuItem.id}
            type="button"
            onClick={() => {
              onNavigate(menuItem);
              onItemClick?.();
            }}
            className={`text-left text-sm font-medium transition-colors ${
              active
                ? "text-orange-500"
                : "text-foreground hover:text-orange-500"
            }`}
          >
            {menuItem.label}
          </button>
        );
      })}
    </nav>
  );
}

function useMenuNavigation() {
  const navigate = useNavigate();

  return useCallback(
    (menuItem) => {
      const isCategory =
        menuItem.id !== "home" &&
        menuItem.id !== "products" &&
        menuItem.id !== "search";

      if (isCategory) {
        navigate(
          `/shop/listing?category=${encodeURIComponent(menuItem.id)}`,
        );
        return;
      }

      navigate(menuItem.path);
    },
    [navigate],
  );
}

function MobileSearchOverlay({ open, onClose }) {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setKeyword("");
      dispatch(resetSearchResults());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (keyword.trim().length === 0) {
      dispatch(resetSearchResults());
      return;
    }

    debounceRef.current = setTimeout(() => {
      dispatch(
        getSearchResults({
          keyword: keyword.trim(),
          filterParams: {},
          sortParams: "price-lowtohigh",
        }),
      );
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keyword, open, dispatch]);

  function handleSubmit() {
    if (keyword.trim().length > 0) {
      onClose();
      navigate(
        `/shop/search?keyword=${encodeURIComponent(keyword.trim())}`,
      );
    }
  }

  function handleProductClick(product) {
    onClose();
    navigate(`/shop/product/${product._id}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 top-0 z-50 flex flex-col bg-background lg:hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <SearchBar
          inputRef={inputRef}
          value={keyword}
          onChange={setKeyword}
          onSubmit={handleSubmit}
          placeholder="What are you looking for?"
          className="flex-1"
        />
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-orange-500"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {searchResults.map((product) => {
          const price =
            product?.salePrice > 0 ? product.salePrice : product.price;
          return (
            <button
              key={product._id}
              type="button"
              onClick={() => handleProductClick(product)}
              className="flex w-full items-center gap-4 border-b border-border px-4 py-4 text-left transition-colors hover:bg-muted"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-16 w-16 shrink-0 rounded-md object-cover"
              />
              <div>
                <p className="font-semibold text-foreground">{product.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{price} EGP</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileMenuSheet({ open, onOpenChange }) {
  const menuItems = useNavMenuItems();
  const handleNavigate = useMenuNavigation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      dispatch(fetchCartItems());
      onOpenChange(false);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-full max-w-sm flex-col p-0 [&>button.absolute]:hidden"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <SiteLogo />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <NavLinks
            menuItems={menuItems}
            onNavigate={handleNavigate}
            orientation="vertical"
            onItemClick={() => onOpenChange(false)}
          />

          <div className="mt-10">
            <p className="mb-4 text-base font-bold text-foreground">
              Follow us on
            </p>
            <SocialLinks />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                navigate("/shop/account");
              }}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground"
            >
              <User className="h-4 w-4" />
              {user?.userName}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                navigate("/auth/login");
              }}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground"
            >
              <User className="h-4 w-4" />
              Login
            </button>
          )}
          <DarkModeToggle />
        </div>

        {isAuthenticated && (
          <div className="border-t border-border px-5 py-3">
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ShoppingHeader({
  openCartSheet,
  setOpenCartSheet,
  openMenuSheet,
  setOpenMenuSheet,
  openSearchSheet,
  setOpenSearchSheet,
}) {
  const menuItems = useNavMenuItems();
  const handleNavigate = useMenuNavigation();
  const [desktopKeyword, setDesktopKeyword] = useState("");
  const navigate = useNavigate();

  function handleDesktopSearch() {
    if (desktopKeyword.trim().length > 0) {
      navigate(
        `/shop/search?keyword=${encodeURIComponent(desktopKeyword.trim())}`,
      );
      setDesktopKeyword("");
    }
  }

  return (
    <header className="glass-header sticky top-0 z-40 w-full border-b">
      <AnnouncementBar />

      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6">
          <SiteLogo />
          <SearchBar
            value={desktopKeyword}
            onChange={setDesktopKeyword}
            onSubmit={handleDesktopSearch}
            placeholder="What are you looking for?"
            className="max-w-xl flex-1"
          />
          <div className="flex items-center gap-4">
          <HeaderAuthActions
            openCartSheet={openCartSheet}
            setOpenCartSheet={setOpenCartSheet}
            showCartAmount
          />
            </div>
            
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
            <NavLinks menuItems={menuItems} onNavigate={handleNavigate} />
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      {!openSearchSheet && (
        <div className="relative flex h-16 items-center justify-between px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpenMenuSheet(true)}
            className="flex h-10 w-10 items-center justify-center text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <SiteLogo className="absolute left-1/2 -translate-x-1/2" />

          <button
            type="button"
            onClick={() => navigate("/shop/search")}
            className="flex h-10 w-10 items-center justify-center text-foreground"
            aria-label="Open search"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
      )}

      <MobileSearchOverlay
        open={openSearchSheet}
        onClose={() => setOpenSearchSheet(false)}
      />

      <MobileMenuSheet
        open={openMenuSheet}
        onOpenChange={setOpenMenuSheet}
      />
    </header>
  );
}

export default ShoppingHeader;
