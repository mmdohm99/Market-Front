import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  getPlatformLabel,
  getSocialIcon,
  socialPlatforms,
} from "@/components/common/social-icons";
import {
  createSocialLink,
  deleteSocialLink,
  getAllSocialLinks,
  toggleSocialLinkStatus,
  updateSocialLink,
} from "@/store/admin/social-link-slice";
import { Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

const emptyForm = {
  platform: "",
  label: "",
  url: "",
};

function SocialLinksManager() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { socialLinkList, isLoading } = useSelector(
    (state) => state.adminSocialLink,
  );

  const [formData, setFormData] = useState(emptyForm);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    dispatch(getAllSocialLinks());
  }, [dispatch]);

  const availablePlatforms = useMemo(() => {
    const usedPlatforms = new Set(
      socialLinkList
        .filter((link) => !editingLink || link._id !== editingLink._id)
        .map((link) => link.platform),
    );

    return socialPlatforms.filter((platform) => !usedPlatforms.has(platform.id));
  }, [socialLinkList, editingLink]);

  function resetForm() {
    setFormData(emptyForm);
    setEditingLink(null);
  }

  function handlePlatformChange(platform) {
    const platformMeta = socialPlatforms.find((item) => item.id === platform);
    setFormData((current) => ({
      ...current,
      platform,
      label: platformMeta?.label || current.label,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.platform || !formData.url.trim()) {
      toast({
        title: "Error",
        description: "Please select a platform and enter a URL",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      platform: formData.platform,
      label: formData.label.trim() || getPlatformLabel(formData.platform),
      url: formData.url.trim(),
    };

    try {
      const result = editingLink
        ? await dispatch(
            updateSocialLink({ id: editingLink._id, socialLinkData: payload }),
          )
        : await dispatch(createSocialLink(payload));

      if (result?.payload?.success) {
        toast({
          title: "Success",
          description: editingLink
            ? "Social link updated successfully"
            : "Social link added successfully",
        });
        resetForm();
        dispatch(getAllSocialLinks());
      } else {
        toast({
          title: "Error",
          description:
            result?.payload?.message || "Failed to save social link",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save social link",
        variant: "destructive",
      });
    }
  }

  function handleEdit(link) {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      label: link.label,
      url: link.url,
    });
  }

  async function handleDelete(id) {
    try {
      const result = await dispatch(deleteSocialLink(id));
      if (result?.payload?.success) {
        toast({
          title: "Success",
          description: "Social link deleted successfully",
        });
        if (editingLink?._id === id) {
          resetForm();
        }
        dispatch(getAllSocialLinks());
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete social link",
        variant: "destructive",
      });
    }
  }

  async function handleToggle(id) {
    try {
      await dispatch(toggleSocialLinkStatus(id));
      dispatch(getAllSocialLinks());
    } catch {
      toast({
        title: "Error",
        description: "Failed to update social link status",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="social-platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={handlePlatformChange}
                disabled={Boolean(editingLink)}
              >
                <SelectTrigger id="social-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {(editingLink
                    ? socialPlatforms.filter(
                        (platform) => platform.id === editingLink.platform,
                      )
                    : availablePlatforms
                  ).map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="social-label">Label</Label>
              <Input
                id="social-label"
                value={formData.label}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    label: e.target.value,
                  }))
                }
                placeholder="Instagram"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social-url">URL</Label>
              <Input
                id="social-url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    url: e.target.value,
                  }))
                }
                placeholder="https://instagram.com/your-page"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isLoading}>
              {editingLink ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Link
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </>
              )}
            </Button>
            {editingLink ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>

        <div className="space-y-3">
          {socialLinkList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No social links yet. Add Instagram, WhatsApp, X, or any supported
              platform above.
            </p>
          ) : (
            socialLinkList.map((link) => {
              const Icon = getSocialIcon(link.platform);

              return (
                <div
                  key={link._id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-muted-foreground break-all">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleToggle(link._id)}
                      aria-label={
                        link.isActive ? "Hide social link" : "Show social link"
                      }
                    >
                      {link.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(link)}
                      aria-label="Edit social link"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(link._id)}
                      aria-label="Delete social link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SocialLinksManager;
