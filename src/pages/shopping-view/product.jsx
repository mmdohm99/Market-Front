import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import ProductImageGallery from "@/components/shopping-view/product-image-gallery";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import StarRatingComponent from "@/components/common/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchProductDetails,
  setProductDetails,
} from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { productDetails, isLoading } = useSelector(
    (state) => state.shopProducts,
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const [quantity, setQuantity] = useState(1);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  const isOutOfStock = productDetails?.totalStock === 0;
  const displayPrice =
    productDetails?.salePrice > 0
      ? productDetails.salePrice
      : productDetails?.price;

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }

    return () => {
      dispatch(setProductDetails());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
      setQuantity(1);
    }
  }, [dispatch, productDetails?._id]);

  useEffect(() => {
    const categorySlug = productDetails?.category?.slug;

    if (!categorySlug || !productDetails?._id) return;

    setSimilarLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/shop/products/get?category=${encodeURIComponent(categorySlug)}&sortBy=price-lowtohigh`,
      )
      .then((response) => {
        if (response.data?.success) {
          setSimilarProducts(
            response.data.data
              .filter((item) => item._id !== productDetails._id)
              .slice(0, 4),
          );
        }
      })
      .finally(() => setSimilarLoading(false));
  }, [productDetails?._id, productDetails?.category?.slug]);

  function handleQuantityChange(nextQuantity) {
    if (nextQuantity < 1) return;
    if (nextQuantity > productDetails?.totalStock) {
      toast({
        title: `Only ${productDetails.totalStock} items available`,
        variant: "destructive",
      });
      return;
    }
    setQuantity(nextQuantity);
  }

  function handleAddToCart(redirectToCheckout = false) {
    const getCartItems = cartItems.items || [];
    const existingItem = getCartItems.find(
      (item) => item.productId === productDetails._id,
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;
      if (nextQuantity > productDetails.totalStock) {
        toast({
          title: `Only ${productDetails.totalStock} items available`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails._id,
        quantity,
        product: productDetails,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });

        if (redirectToCheckout) {
          navigate("/shop/checkout");
        }
      }
    });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      }),
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  function handleSimilarAddToCart(currentProductId, totalStock) {
    const product = similarProducts.find(
      (item) => item._id === currentProductId || item.id === currentProductId,
    );
    const existingItems = cartItems.items || [];
    const existingItem = existingItems.find(
      (item) => item.productId === currentProductId,
    );

    if (existingItem && existingItem.quantity + 1 > totalStock) {
      toast({
        title: `Only ${totalStock} items available`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: currentProductId,
        quantity: 1,
        product,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  if (isLoading || !productDetails || productDetails._id !== productId) {
    return (
      <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const categoryName = productDetails?.category?.name || "Shop";
  const categorySlug = productDetails?.category?.slug;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/shop/listing" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        {categorySlug ? (
          <Link
            to={`/shop/listing?category=${encodeURIComponent(categorySlug)}`}
            className="hover:text-foreground"
          >
            {categoryName}
          </Link>
        ) : (
          <span>{categoryName}</span>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImageGallery product={productDetails} />

        <div>
          {isOutOfStock && (
            <Badge
              variant="outline"
              className="mb-4 border-orange-400 text-orange-500"
            >
              Out of stock
            </Badge>
          )}

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {productDetails.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <StarRatingComponent rating={averageReview} />
            <span className="text-sm text-muted-foreground">
              {averageReview.toFixed(1)}/5 - {reviews?.length || 0} reviews
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            {productDetails?.salePrice > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                {productDetails.price} EGP
              </span>
            )}
            <span className="text-3xl font-bold text-foreground">
              {displayPrice} EGP
            </span>
          </div>

          <div className="mt-8">
            <Label className="mb-2 block">Quantity</Label>
            <div className="flex w-fit items-center rounded-full border border-border">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                disabled={isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-12 text-center text-lg font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                disabled={isOutOfStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 flex-1 rounded-full bg-orange-200 text-foreground hover:bg-orange-300"
              disabled={isOutOfStock}
              onClick={() => handleAddToCart(false)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to cart
            </Button>
            <Button
              size="lg"
              className="h-12 flex-1 rounded-full bg-orange-200 text-foreground hover:bg-orange-300"
              disabled={isOutOfStock}
              onClick={() => handleAddToCart(true)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-12 rounded-xl border border-border bg-background p-6">
        <div className="border-b border-border pb-3">
          <h2 className="inline-block border-b-2 border-orange-500 pb-2 text-lg font-semibold">
            Overview
          </h2>
        </div>
        <div className="mt-6 space-y-2 text-foreground">
          <p className="text-lg font-semibold">{productDetails.title}</p>
          <p className="whitespace-pre-line text-muted-foreground">
            {productDetails.description || "No description available."}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground">
          Customer ratings &amp; reviews
        </h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-xl border border-border p-6">
            <p className="font-semibold">Overall rating</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold">{averageReview.toFixed(1)}</span>
              <StarRatingComponent rating={averageReview} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {reviews?.length || 0} reviews
            </p>

            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  reviews?.filter((review) => review.reviewValue === star)
                    .length || 0;
                const width =
                  reviews?.length > 0 ? `${(count / reviews.length) * 100}%` : "0%";

                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-3">{star}</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-orange-400"
                        style={{ width }}
                      />
                    </div>
                    <span className="w-4 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>

            <Button
              className="mt-6 w-full rounded-full bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                if (!user?.id) {
                  navigate("/auth/login");
                }
              }}
            >
              Write a review
            </Button>

            {user?.id && (
              <div className="mt-6 space-y-3 border-t border-border pt-6">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={setRating}
                />
                <Input
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Share your experience..."
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === "" || rating === 0}
                  className="w-full"
                >
                  Submit review
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div key={reviewItem._id} className="flex gap-4 border-b border-border pb-6">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>
                      {reviewItem?.userName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{reviewItem.userName}</p>
                    <StarRatingComponent rating={reviewItem.reviewValue} />
                    <p className="mt-2 text-muted-foreground">
                      {reviewItem.reviewMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-12 text-center text-muted-foreground">
                No reviews added yet
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Similar products</h2>
          {categorySlug && (
            <Link
              to={`/shop/listing?category=${encodeURIComponent(categorySlug)}`}
              className="text-sm font-medium text-foreground hover:text-orange-500"
            >
              See all products
            </Link>
          )}
        </div>

        {similarLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[380px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleAddtoCart={handleSimilarAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductPage;
