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
import { getSiteAnnouncement } from "@/store/site-announcement-slice";
import { getActiveSocialLinks } from "@/store/admin/social-link-slice";
import { getSocialIcon } from "@/components/common/social-icons";

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
  const dispatch = useDispatch();
  const { text, isEnabled } = useSelector((state) => state.siteAnnouncement);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    dispatch(getSiteAnnouncement());
  }, [dispatch]);

  if (!isEnabled || !text?.trim() || closing) {
    return null;
  }

  return (
    <div className="overflow-hidden bg-orange-500 transition-all duration-300 max-h-20 opacity-100 py-2.5">
      <div className="relative flex items-center justify-center px-10 text-center text-sm text-white">
        <p>{text}</p>

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
  const dispatch = useDispatch();
  const { activeSocialLinkList } = useSelector((state) => state.adminSocialLink);

  useEffect(() => {
    dispatch(getActiveSocialLinks());
  }, [dispatch]);

  if (!activeSocialLinkList?.length) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {activeSocialLinkList.map((link) => {
        const Icon = getSocialIcon(link.platform);

        return (
          <a
            key={link._id}
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
