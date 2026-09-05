import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createNewOrder } from "@/store/shop/order-slice";
import { clearCart, fetchCartItems } from "@/store/shop/cart-slice";

const EGYPT_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Port Said",
  "Suez",
  "Luxor",
  "Aswan",
  "Asyut",
  "Beheira",
  "Beni Suef",
  "Dakahlia",
  "Damietta",
  "Faiyum",
  "Gharbia",
  "Ismailia",
  "Kafr El Sheikh",
  "Matrouh",
  "Minya",
  "Monufia",
  "New Valley",
  "North Sinai",
  "Qena",
  "Red Sea",
  "Sharqia",
  "Sohag",
  "South Sinai",
];

const initialFormData = {
  name: "",
  email: "",
  marketingOptIn: false,
  phone: "",
  secondaryPhone: "",
  address: "",
  apartment: "",
  country: "Egypt",
  city: "",
};

function CheckoutField({ label, required, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-orange-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function ShoppingCheckout() {
  const { cartItems, isLoading: isCartLoading } = useSelector(
    (state) => state.shopCart,
  );
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const items = cartItems?.items || [];

  const subtotal =
    items.length > 0
      ? items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0,
        )
      : 0;

  const total = Math.max(subtotal - discount, 0);

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (isCartLoading) return;
    if (items.length === 0) {
      navigate("/shop/home");
    }
  }, [items.length, isCartLoading, navigate]);

  function updateField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function isFormValid() {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.apartment.trim() &&
      formData.country.trim() &&
      formData.city.trim()
    );
  }

  function handleApplyCoupon(event) {
    event.preventDefault();
    if (!couponCode.trim()) return;
    setDiscount(0);
    toast({
      title: "Coupon not recognized",
      description: "This coupon code is not valid.",
      variant: "destructive",
    });
  }

  function handlePlaceOrder(event) {
    event.preventDefault();

    if (items.length === 0) {
      toast({
        title: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id || null,
      cartId: cartItems?._id || null,
      cartItems: items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        apartment: formData.apartment.trim(),
        country: formData.country,
        city: formData.city,
        phone: `+20${formData.phone.trim()}`,
        secondaryPhone: formData.secondaryPhone.trim()
          ? `+20${formData.secondaryPhone.trim()}`
          : "",
        marketingOptIn: formData.marketingOptIn,
        notes: "",
      },
      totalAmount: total,
    };

    dispatch(createNewOrder(orderData)).then((res) => {
      if (res?.payload?.success) {
        dispatch(clearCart());
        toast({
          title: "Order placed successfully!",
          description: "We will contact you shortly to confirm delivery.",
        });
        navigate("/shop/home");
      } else {
        toast({
          title: "Failed to place order",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
<header className="relative border-b border-border px-4 py-4 sm:px-6">
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft className="h-4 w-4" />
    Return to Cart
  </button>
  <Link
    to="/shop/home"
    className="absolute left-1/2 top-1/2 flex h-18 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md  p-1.5"
  >
    <img
      src="/nodum.png"
      alt="Nodum Gallery"
      className="h-full w-full object-contain"
    />
  </Link>
</header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 lg:grid-cols-[1fr_380px] lg:px-6">
        <form onSubmit={handlePlaceOrder} className="space-y-10">
          <section className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">
              Contact Information
            </h2>

            <CheckoutField label="Name" required>
              <Input
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </CheckoutField>

            <CheckoutField label="Email" required>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </CheckoutField>

            <div className="flex items-center gap-2">
              <Checkbox
                id="marketing"
                checked={formData.marketingOptIn}
                onCheckedChange={(checked) =>
                  updateField("marketingOptIn", checked === true)
                }
              />
              <Label
                htmlFor="marketing"
                className="text-sm font-normal text-muted-foreground"
              >
                Keep me up-to-date on news and exclusive offers
              </Label>
            </div>

            <CheckoutField label="Phone no." required>
              <div className="flex overflow-hidden rounded-md border border-input">
                <div className="flex items-center gap-2 border-r border-input bg-muted/40 px-3 text-sm text-muted-foreground">
                  <span aria-hidden>🇪🇬</span>
                  <span>+20</span>
                </div>
                <Input
                  type="tel"
                  placeholder="1xxxxxxxxx"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </CheckoutField>

            <CheckoutField label="Secondary phone no. [Optional]">
              <div className="flex overflow-hidden rounded-md border border-input">
                <div className="flex items-center gap-2 border-r border-input bg-muted/40 px-3 text-sm text-muted-foreground">
                  <span aria-hidden>🇪🇬</span>
                  <span>+20</span>
                </div>
                <Input
                  type="tel"
                  placeholder="1xxxxxxxxx"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={formData.secondaryPhone}
                  onChange={(e) =>
                    updateField("secondaryPhone", e.target.value)
                  }
                />
              </div>
            </CheckoutField>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">
              Shipping Information
            </h2>

            <CheckoutField label="Address" required>
              <Input
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </CheckoutField>

            <CheckoutField label="Apartment, suite, unit etc." required>
              <Input
                placeholder="Enter your apartment, suite, unit etc."
                value={formData.apartment}
                onChange={(e) => updateField("apartment", e.target.value)}
              />
            </CheckoutField>

            <CheckoutField label="Country" required>
              <Select
                value={formData.country}
                onValueChange={(value) => updateField("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Egypt">Egypt</SelectItem>
                </SelectContent>
              </Select>
            </CheckoutField>

            <CheckoutField label="City/Governorate" required>
              <Select
                value={formData.city}
                onValueChange={(value) => updateField("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="City/Governorate" />
                </SelectTrigger>
                <SelectContent>
                  {EGYPT_GOVERNORATES.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {gov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CheckoutField>
          </section>

          <Button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="h-12 w-full rounded-md bg-orange-500 text-base font-medium hover:bg-orange-600"
          >
            {isLoading ? "Processing..." : "Continue to Delivery"}
            {!isLoading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
          </Button>
        </form>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              {items.map((item) => {
                const linePrice =
                  (item?.salePrice > 0 ? item?.salePrice : item?.price) *
                  item?.quantity;

                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item?.image}
                        alt={item?.title}
                        className="h-16 w-16 rounded-md border border-border object-cover"
                      />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                        {item?.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item?.title}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-foreground">
                      {linePrice.toFixed(0)} EGP
                    </p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button type="submit" variant="outline" className="shrink-0">
                Apply
              </Button>
            </form>

            <div className="space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(0)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">
                  -{discount.toFixed(0)} EGP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">To be calculated</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-2xl font-bold text-foreground">
                  {total.toFixed(0)} EGP
                </span>
              </div>
              <p className="mt-1 text-right text-xs text-muted-foreground">
                + Shipping
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
