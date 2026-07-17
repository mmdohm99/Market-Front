import ProductImagesUpload from "@/components/admin-view/product-images-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import {
  buildProductImagePayload,
  getProductMainImage,
  getProductSubImages,
} from "@/lib/product-images";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { getAllCategories } from "@/store/admin/category-slice";
import { getAllBrands } from "@/store/admin/brand-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [mainImage, setMainImage] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const { categoryList } = useSelector((state) => state.adminCategory);
  const { brandList } = useSelector((state) => state.adminBrand);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    if (!mainImage) {
      toast({
        title: "Error",
        description: "Please upload a main product image",
        variant: "destructive",
      });
      return;
    }

    const imagePayload = buildProductImagePayload(mainImage, subImages);
    const payload = {
      ...formData,
      ...imagePayload,
    };

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: payload,
          }),
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            handleCloseProductSheet();
            toast({
              title: "Product updated successfully",
            });
          }
        })
      : dispatch(addNewProduct(payload)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            handleCloseProductSheet();
            toast({
              title: "Product added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    if (!mainImage) return false;

    return Object.keys(formData)
      .filter(
        (currentKey) =>
          currentKey !== "averageReview" && currentKey !== "image",
      )
      .map((key) => formData[key] !== "" && formData[key] != null)
      .every((item) => item);
  }

  function handleCloseProductSheet() {
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setMainImage("");
    setSubImages([]);
  }

  function handleEditProduct(product) {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);
    setFormData(product);
    setMainImage(getProductMainImage(product));
    setSubImages(getProductSubImages(product));
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllCategories());
    dispatch(getAllBrands());
  }, [dispatch]);

  const getDynamicFormElements = () => {
    return addProductFormElements.map((element) => {
      if (element.name === "category") {
        return {
          ...element,
          options: categoryList.map((category) => ({
            id: category._id,
            label: category.name,
          })),
        };
      }
      if (element.name === "brand") {
        return {
          ...element,
          options: brandList.map((brand) => ({
            id: brand._id,
            label: brand.name,
          })),
        };
      }
      return element;
    });
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                product={productItem}
                onEdit={handleEditProduct}
                handleDelete={handleDelete}
                key={productItem.id || productItem._id}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) handleCloseProductSheet();
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <ProductImagesUpload
              mainImage={mainImage}
              subImages={subImages}
              onMainImageChange={(url) => {
                setMainImage(url);
                setFormData((prev) => ({ ...prev, image: url }));
              }}
              onSubImagesChange={setSubImages}
            />
          </div>
          <div className="pb-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={getDynamicFormElements()}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
