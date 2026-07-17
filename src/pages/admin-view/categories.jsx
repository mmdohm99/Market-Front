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
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/store/admin/category-slice";
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react";

function AdminCategories() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { categoryList, isLoading } = useSelector(
    (state) => state.adminCategory
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
    isActive: true,
    order: 0,
    slug: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please fill in the category name",
        variant: "destructive",
      });
      return;
    }

    const categoryPayload = {
      ...formData,
      image: uploadedImageUrl || formData.image,
    };

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({ id: editingCategory._id, categoryData: categoryPayload })
        );
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await dispatch(
          createCategory({
            ...categoryPayload,
            slug: formData.name.toLowerCase().replace(/ /g, "-"),
          })
        );
        toast({
          title: "Success",
          description: "Category created successfully",
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

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      image: category.image || "",
      isActive: category.isActive,
      order: category.order,
      slug: category.slug,
    });
    setUploadedImageUrl(category.image || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteCategory(categoryId));
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Cannot delete category. It may be in use by products.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (categoryId) => {
    try {
      await dispatch(toggleCategoryStatus(categoryId));
      toast({
        title: "Success",
        description: "Category status updated",
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
      icon: "",
      image: "",
      isActive: true,
      order: 0,
    });
    setEditingCategory(null);
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
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
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
                  placeholder="Enter icon name (e.g., ShirtIcon)"
                />
              </div>

              <div>
                <Label htmlFor="image">Category Image</Label>
                <ProductImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  onImageUrlChange={(url) =>
                    setFormData((prev) => ({ ...prev, image: url }))
                  }
                  isCustomStyling={true}
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
                <Button
                  type="submit"
                  disabled={isLoading || imageLoadingState}
                >
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryList.map((category) => (
          <Card key={category._id} className="overflow-hidden">
            <div className="relative">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover"
                />
              )}
              <Badge
                className={`absolute top-2 right-2 ${
                  category.isActive ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              {category.description && (
                <p className="text-sm ">{category.description}</p>
              )}
              <p className="text-xs ">Order: {category.order}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(category._id)}
                >
                  {category.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category._id)}
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

export default AdminCategories;
