import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
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
import { useEffect, useState, useMemo } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { getActiveCategories } from "@/store/admin/category-slice";
import { toggleDarkMode } from "@/lib/theme";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { activeCategoryList } = useSelector((state) => state.adminCategory);

  useEffect(() => {
    dispatch(getActiveCategories());
  }, [dispatch]);

  const menuItems = useMemo(() => {
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
    ];
  }, [activeCategoryList]);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`),
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {menuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function MobileSearch() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  function handleGlobalSearch() {
    if (searchKeyword.trim().length > 0) {
      navigate(
        `/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`,
      );
      setSearchKeyword("");
    }
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleGlobalSearch()}
        placeholder="Search products..."
        className="h-9"
      />
      <Button onClick={handleGlobalSearch} size="sm" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

function GlobalSearch() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  function handleGlobalSearch() {
    if (searchKeyword.trim().length > 0) {
      navigate(
        `/shop/search?keyword=${encodeURIComponent(searchKeyword.trim())}`,
      );
      setSearchKeyword("");
    }
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-md mx-4">
      <Input
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleGlobalSearch()}
        placeholder="Search products..."
        className="h-9"
      />
      <Button onClick={handleGlobalSearch} size="sm" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Now accepts openCartSheet + setOpenCartSheet from parent (ShoppingLayout)
function HeaderRightContent({ openCartSheet, setOpenCartSheet }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      dispatch(fetchCartItems());
    });
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  function handleToggleDarkMode() {
    setIsDarkMode(toggleDarkMode());
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Button onClick={handleToggleDarkMode} variant="outline" size="sm">
        {isDarkMode ? (
          <Sun className="w-4 h-4 mr-2" />
        ) : (
          <Moon className="w-4 h-4 mr-2" />
        )}
        {isDarkMode ? "Light" : "Dark"}
      </Button>

      {/* Cart Sheet — controlled by lifted state */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-primary cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
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
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/auth/register")}>
            Sign up
          </Button>
        </div>
      )}
    </div>
  );
}

// Accepts all four sheet state props from ShoppingLayout
function ShoppingHeader({
  openCartSheet,
  setOpenCartSheet,
  openMenuSheet,
  setOpenMenuSheet,
}) {
  return (
    <header className="glass-header sticky top-0 z-40 w-full border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 font-heading shrink-0"
        >
          <HousePlug className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">Nodum</span>
        </Link>

        {/* Mobile: search bar between logo and hamburger */}
        <div className="flex lg:hidden flex-1 mx-3">
          <GlobalSearch />
        </div>

        {/* Mobile: hamburger sheet — controlled by lifted openMenuSheet state */}
        <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
            <MenuItems />
            <HeaderRightContent
              openCartSheet={openCartSheet}
              setOpenCartSheet={setOpenCartSheet}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop: nav centered */}
        <div className="hidden lg:flex items-center flex-1 justify-center">
          <MenuItems />
        </div>

        {/* Desktop: search + right content */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
          <GlobalSearch />
          <HeaderRightContent
            openCartSheet={openCartSheet}
            setOpenCartSheet={setOpenCartSheet}
          />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
