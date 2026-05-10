import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Image,
  Tag,
  Award,
  Palette,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useSelector } from "react-redux";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "banners",
    label: "Banners",
    path: "/admin/banners",
    icon: <Image />,
  },
  {
    id: "categories",
    label: "Categories",
    path: "/admin/categories",
    icon: <Tag />,
  },
  {
    id: "brands",
    label: "Brands",
    path: "/admin/brands",
    icon: <Award />,
  },
  {
    id: "theme",
    label: "Theme",
    path: "/admin/theme",
    icon: <Palette />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const { palette } = useSelector((state) => state.theme);

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                {palette?.logo ? (
                  <img
                    src={palette.logo}
                    alt="Site logo"
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <ChartNoAxesCombined size={30} className="text-primary" />
                )}
                <h1 className="font-heading text-2xl font-extrabold text-foreground">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="glass-panel hidden w-64 flex-col border-y-0 border-l-0 rounded-none border-r p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          {palette?.logo ? (
            <img
              src={palette.logo}
              alt="Site logo"
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <ChartNoAxesCombined size={30} className="text-primary" />
          )}
          <h1 className="font-heading text-2xl font-extrabold text-foreground">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
