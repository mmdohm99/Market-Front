import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { getProductMainImage } from "@/lib/product-images";

function AdminProductTile({ key, product, onEdit, handleDelete }) {
  const subImageCount = Math.max((product?.subImages?.length || 0), 0);

  return (
    <Card key={key} className="mx-auto w-full max-w-sm">
      <div>
        <div className="relative">
          <img
            src={getProductMainImage(product)}
            alt={product?.title}
            className="h-[300px] w-full rounded-t-lg object-cover"
          />
          {subImageCount > 0 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
              +{subImageCount} sub
            </span>
          )}
        </div>
        <CardContent>
          <h2 className="mb-2 mt-2 font-heading text-xl font-bold text-foreground">
            {product?.title}
          </h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {product?.category?.name || product?.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {product?.brand?.name || product?.brand}
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
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-sale">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button onClick={() => onEdit(product)}>Edit</Button>
          <Button variant="destructive" onClick={() => handleDelete(product?._id)}>
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
