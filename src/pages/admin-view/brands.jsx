import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ProductImageUpload from "@/components/admin-view/image-upload";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
} from "@/store/admin/brand-slice";
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react";

function AdminBrands() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { brandList, isLoading } = useSelector((state) => state.adminBrand);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    icon: "",
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(getAllBrands());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please fill in the brand name",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingBrand) {
        await dispatch(
          updateBrand({ id: editingBrand._id, brandData: formData })
        );
        toast({
          title: "Success",
          description: "Brand updated successfully",
        });
      } else {
        await dispatch(
          createBrand({
            ...formData,
            slug: formData.name.toLowerCase().replace(/ /g, "-"),
          })
        );
        toast({
          title: "Success",
          description: "Brand created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      logo: brand.logo || "",
      icon: brand.icon || "",
      isActive: brand.isActive,
      order: brand.order,
    });
    setUploadedImageUrl(brand.logo || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (brandId) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await dispatch(deleteBrand(brandId));
        toast({
          title: "Success",
          description: "Brand deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Cannot delete brand. It may be in use by products.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (brandId) => {
    try {
      await dispatch(toggleBrandStatus(brandId));
      toast({
        title: "Success",
        description: "Brand status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      icon: "",
      isActive: true,
      order: 0,
    });
    setEditingBrand(null);
    setImageFile(null);
    setUploadedImageUrl("");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brand Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter brand description"
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="Enter icon name (e.g., Shirt)"
                />
              </div>

              <div>
                <Label htmlFor="logo">Brand Logo</Label>
                <ProductImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  isCustomStyling={true}
                />
                <Input
                  type="hidden"
                  value={uploadedImageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Display order"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {editingBrand ? "Update" : "Create"} Brand
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandList.map((brand) => (
          <Card key={brand._id} className="overflow-hidden">
            <div className="relative">
              {brand.logo && (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-32 object-cover"
                />
              )}
              <Badge
                className={`absolute top-2 right-2 ${
                  brand.isActive ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                }`}
              >
                {brand.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{brand.name}</CardTitle>
              {brand.description && (
                <p className="text-sm text-gray-600">{brand.description}</p>
              )}
              <p className="text-xs text-gray-500">Order: {brand.order}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(brand)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(brand._id)}
                >
                  {brand.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(brand._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminBrands;
