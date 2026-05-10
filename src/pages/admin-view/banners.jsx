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
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from "@/store/admin/banner-slice";
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react";

function AdminBanners() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { bannerList, isLoading } = useSelector((state) => state.adminBanner);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    link: "",
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(getAllBanners());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.image || !formData.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingBanner) {
        await dispatch(
          updateBanner({ id: editingBanner._id, bannerData: formData })
        );
        toast({
          title: "Success",
          description: "Banner updated successfully",
        });
      } else {
        await dispatch(createBanner(formData));
        toast({
          title: "Success",
          description: "Banner created successfully",
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

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      image: banner.image,
      title: banner.title,
      description: banner.description || "",
      link: banner.link || "",
      isActive: banner.isActive,
      order: banner.order,
    });
    setUploadedImageUrl(banner.image);
    setIsDialogOpen(true);
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await dispatch(deleteBanner(bannerId));
        toast({
          title: "Success",
          description: "Banner deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (bannerId) => {
    try {
      await dispatch(toggleBannerStatus(bannerId));
      toast({
        title: "Success",
        description: "Banner status updated",
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
      image: "",
      title: "",
      description: "",
      link: "",
      isActive: true,
      order: 0,
    });
    setEditingBanner(null);
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
        <h1 className="text-3xl font-bold">Banner Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image">Banner Image *</Label>
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
                  onChange={(e) => {
                    console.log(e.target.value, "e.target.value");
                    setFormData({ ...formData, image: e.target.value });
                  }}
                />
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter banner title"
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
                  placeholder="Enter banner description"
                />
              </div>

              <div>
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="Enter link URL (optional)"
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
                  {editingBanner ? "Update" : "Create"} Banner
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bannerList.map((banner) => (
          <Card key={banner._id} className="overflow-hidden">
            <div className="relative">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-48 object-cover"
              />
              <Badge
                className={`absolute top-2 right-2 ${
                  banner.isActive ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                }`}
              >
                {banner.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{banner.title}</CardTitle>
              {banner.description && (
                <p className="text-sm text-gray-600">{banner.description}</p>
              )}
              <p className="text-xs text-gray-500">Order: {banner.order}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(banner)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(banner._id)}
                >
                  {banner.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(banner._id)}
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

export default AdminBanners;
