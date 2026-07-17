import { Outlet, NavLink } from "react-router-dom";
import { Home, Store, ShoppingCart, User, Menu } from "lucide-react";
import ShoppingHeader from "./header";
import { useState } from "react";

function BottomNav({ onCartOpen, onMenuOpen }) {
  return (
    <nav className="glass-header fixed bottom-0 left-0 right-0 z-50 border-t border-border lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {/* Home */}
        <NavLink
          to="/shop/home"
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors duration-150 ${
              isActive ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>Home</span>
            </>
          )}
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/shop/listing"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors duration-150 ${
              isActive ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Store size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>Shop</span>
            </>
          )}
        </NavLink>

        {/* Cart — opens sheet, no navigation */}
        <button
          onClick={onCartOpen}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <ShoppingCart size={22} strokeWidth={1.8} />
          <span>Cart</span>
        </button>

        {/* Account */}
        <NavLink
          to="/shop/account"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors duration-150 ${
              isActive ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>Account</span>
            </>
          )}
        </NavLink>

        {/* Menu — opens mobile sheet, no navigation */}
        <button
          onClick={onMenuOpen}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <Menu size={22} strokeWidth={1.8} />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
}

function ShoppingLayout() {
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const [openSearchSheet, setOpenSearchSheet] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-transparent">
      <ShoppingHeader
        openCartSheet={openCartSheet}
        setOpenCartSheet={setOpenCartSheet}
        openMenuSheet={openMenuSheet}
        setOpenMenuSheet={setOpenMenuSheet}
        openSearchSheet={openSearchSheet}
        setOpenSearchSheet={setOpenSearchSheet}
      />
      <main className="flex flex-col w-full pb-16 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav
        onCartOpen={() => setOpenCartSheet(true)}
        onMenuOpen={() => setOpenMenuSheet(true)}
      />
    </div>
  );
}

export default ShoppingLayout;
