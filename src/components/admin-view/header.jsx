import { AlignJustify, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toggleDarkMode } from "@/lib/theme";
import { useState } from "react";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleToggleDarkMode() {
    setIsDarkMode(toggleDarkMode());
  }

  return (
    <header className="glass-header flex items-center justify-between border-b px-4 py-3">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleToggleDarkMode}
          className="inline-flex gap-2 items-center"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {isDarkMode ? "Light" : "Dark"}
        </Button>
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
