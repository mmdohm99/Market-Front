import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

function ShoppingProductTile({ key, product, handleAddtoCart }) {
  const navigate = useNavigate();
  const productId = product?._id || product?.id;

  function handleOpenProduct() {
    if (productId) {
      navigate(`/shop/product/${productId}`);
    }
  }

  return (
    <Card
      key={key}
      className="group mx-auto w-full max-w-sm overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:scale-[1.02]"
    >
      <div onClick={handleOpenProduct} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-[300px] w-full rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground hover:opacity-90">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute left-2 top-2 bg-sale text-sale-foreground hover:opacity-90">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute left-2 top-2 bg-sale text-sale-foreground hover:opacity-90">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
            {product?.title}
          </h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[16px] text-muted-foreground">
              {product?.category?.name || categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {product?.brand?.name || brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-muted-foreground"
                  : "text-primary"
              } text-lg font-semibold`}
            >
              {product?.price} EGP
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-sale">
                {product?.salePrice} EGP
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full cursor-not-allowed opacity-60">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(productId, product?.totalStock)}
            className="w-full transition-transform hover:scale-[1.02] active:scale-[0.98] bg-pink-800 text-white"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
