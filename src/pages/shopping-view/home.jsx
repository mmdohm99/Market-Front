import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { getActiveBanners } from "@/store/admin/banner-slice";
import { getActiveCategories } from "@/store/admin/category-slice";
import { getActiveBrands } from "@/store/admin/brand-slice";

const iconMap = {
  ShirtIcon,
  CloudLightning,
  BabyIcon,
  WatchIcon,
  UmbrellaIcon,
  Shirt,
  WashingMachine,
  ShoppingBasket,
  Airplay,
  Images,
  Heater,
};

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { activeBannerList } = useSelector((state) => state.adminBanner);
  const { activeCategoryList } = useSelector((state) => state.adminCategory);
  const { activeBrandList } = useSelector((state) => state.adminBrand);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const banners =
      activeBannerList.length > 0 ? activeBannerList : featureImageList;
    if (banners.length > 0) {
      const t = setInterval(
        () => setCurrentSlide((p) => (p + 1) % banners.length),
        5000,
      );
      return () => clearInterval(t);
    }
  }, [activeBannerList, featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getActiveBanners());
    dispatch(getActiveCategories());
    dispatch(getActiveBrands());
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  const banners =
    activeBannerList.length > 0 ? activeBannerList : featureImageList;
  const hasBanners = banners && banners.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden">
        {hasBanners ? (
          banners.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={slide?.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg animate-fade-in-up"
            style={{ animationFillMode: "forwards" }}
          >
            Handcrafted for you
          </h1>
          <p
            className="mt-4 max-w-xl text-lg text-white/90 drop-shadow animate-fade-in-up animate-delay-100 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Discover unique pieces from independent makers. Shop the collection.
          </p>
          <Button
            size="lg"
            className="mt-8 animate-fade-in-up animate-delay-200 opacity-0 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-transform"
            style={{ animationFillMode: "forwards" }}
            onClick={() => navigate("/shop/listing")}
          >
            Shop now
          </Button>
        </div>
        {hasBanners && banners.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (p) => (p - 1 + banners.length) % banners.length,
                )
              }
              className="absolute top-1/2 left-4 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 border-0 shadow-lg hover:bg-white hover:scale-110 transition-transform"
            >
              <ChevronLeftIcon className="h-5 w-5 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlide((p) => (p + 1) % banners.length)}
              className="absolute top-1/2 right-4 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 border-0 shadow-lg hover:bg-white hover:scale-110 transition-transform"
            >
              <ChevronRightIcon className="h-5 w-5 text-foreground" />
            </Button>
          </>
        )}
      </div>

      {/* Shop by category */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-foreground animate-fade-in-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Shop by category
          </h2>
          <p
            className="text-center text-muted-foreground mb-10 animate-fade-in-up animate-delay-100 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Find what you love
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {activeCategoryList?.length > 0
              ? activeCategoryList.map((categoryItem, i) => {
                  const IconComponent = iconMap[categoryItem.icon] ?? ShirtIcon;
                  return (
                    <Card
                      key={categoryItem._id}
                      onClick={() =>
                        handleNavigateToListingPage(
                          {
                            id: categoryItem.slug,
                            label: categoryItem.name,
                          },
                          "category",
                        )
                      }
                      className="group cursor-pointer border-2 border-transparent hover:border-primary/30 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0"
                      style={{
                        animationFillMode: "forwards",
                        animationDelay: `${180 + i * 60}ms`,
                      }}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="rounded-full bg-primary/10 p-4 mb-3 group-hover:bg-primary/20 transition-colors">
                          {IconComponent && (
                            <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                          )}
                        </div>
                        <span className="font-bold text-foreground">
                          {categoryItem.name}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })
              : null}
          </div>
        </div>
      </section>

      {/* Shop by brand */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-foreground animate-fade-in-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Shop by brand
          </h2>
          <p
            className="text-center text-muted-foreground mb-10 animate-fade-in-up animate-delay-100 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Curated makers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {activeBrandList?.length > 0
              ? activeBrandList.map((brandItem, i) => {
                  const IconComponent = iconMap[brandItem.icon] ?? Shirt;
                  return (
                    <Card
                      key={brandItem._id}
                      onClick={() =>
                        handleNavigateToListingPage(
                          {
                            id: brandItem.slug,
                            label: brandItem.name,
                          },
                          "brand",
                        )
                      }
                      className="group cursor-pointer border-2 border-transparent hover:border-primary/30 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0"
                      style={{
                        animationFillMode: "forwards",
                        animationDelay: `${180 + i * 50}ms`,
                      }}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="rounded-full bg-primary/10 p-3 mb-2 group-hover:bg-primary/20 transition-colors">
                          {IconComponent && (
                            <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                          )}
                        </div>
                        <span className="font-bold text-sm md:text-base text-foreground">
                          {brandItem.name}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })
              : null}
          </div>
        </div>
      </section>

      {/* Feature products */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-foreground animate-fade-in-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Feature products
          </h2>
          <p
            className="text-center text-muted-foreground mb-10 animate-fade-in-up animate-delay-100 opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Bestsellers and new arrivals
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0
              ? productList.map((productItem, i) => (
                  <div
                    key={productItem._id ?? productItem.id}
                    className="animate-fade-in-up opacity-0"
                    style={{
                      animationFillMode: "forwards",
                      animationDelay: `${120 + i * 80}ms`,
                    }}
                  >
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
