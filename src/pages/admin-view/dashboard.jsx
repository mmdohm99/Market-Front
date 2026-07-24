import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
  reorderFeatureImages,
} from "@/store/common-slice";
import {
  getAdminSiteAnnouncement,
  updateSiteAnnouncement,
} from "@/store/site-announcement-slice";
import SocialLinksManager from "@/components/admin-view/social-links-manager";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [orderedImages, setOrderedImages] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // Drag state
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { text, isEnabled, isSaving } = useSelector(
    (state) => state.siteAnnouncement,
  );

  // Keep local ordered list in sync with Redux store
  useEffect(() => {
    if (featureImageList) setOrderedImages(featureImageList);
  }, [featureImageList]);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  // ── Drag-and-drop handlers ──────────────────────────────────────────────────

  function handleDragStart(index) {
    dragItem.current = index;
  }

  function handleDragEnter(index) {
    dragOverItem.current = index;

    // Live visual reorder while dragging
    const updated = [...orderedImages];
    const dragged = updated.splice(dragItem.current, 1)[0];
    updated.splice(index, 0, dragged);
    dragItem.current = index; // keep index in sync
    setOrderedImages(updated);
  }

  function handleDragEnd() {
    // Persist final order to the backend / Redux
    const ids = orderedImages.map((img) => img._id);
    dispatch(reorderFeatureImages(ids)).then((data) => {
      if (data?.payload?.success) dispatch(getFeatureImages());
    });
    dragItem.current = null;
    dragOverItem.current = null;
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getAdminSiteAnnouncement());
  }, [dispatch]);

  useEffect(() => {
    setAnnouncementText(text);
    setAnnouncementEnabled(isEnabled);
  }, [text, isEnabled]);

  async function handleSaveAnnouncement() {
    try {
      const result = await dispatch(
        updateSiteAnnouncement({
          text: announcementText,
          isEnabled: announcementEnabled,
        }),
      );

      if (result?.payload?.success) {
        toast({
          title: "Success",
          description: "Site announcement saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save site announcement",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save site announcement",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Site Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement-text">Announcement text</Label>
            <Textarea
              id="announcement-text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="حجز الأوردر : 50% من ثمن الأوردر"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="announcement-enabled"
              checked={announcementEnabled}
              onCheckedChange={(checked) =>
                setAnnouncementEnabled(checked === true)
              }
            />
            <Label htmlFor="announcement-enabled">
              Show announcement bar on the shop
            </Label>
          </div>

          <Button onClick={handleSaveAnnouncement} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Announcement"}
          </Button>
        </CardContent>
      </Card>

      <SocialLinksManager />

      <div>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />

        <Button
          onClick={handleUploadFeatureImage}
          className="mt-5 w-full"
          disabled={!uploadedImageUrl || imageLoadingState}
        >
          Upload
        </Button>

        {/* ── Image grid with delete + drag-to-sort ── */}
        <div className="flex flex-col gap-4 mt-5">
          {orderedImages && orderedImages.length > 0
            ? orderedImages.map((featureImgItem, index) => (
                <div
                  key={featureImgItem._id}
                  className="relative group cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()} // required to allow drop
                >
                  {/* Drag handle hint */}
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded px-2 py-1 text-xs select-none pointer-events-none">
                    ⠿ drag to reorder
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteImage(featureImgItem._id)}
                    className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>

                  <img
                    src={featureImgItem.image}
                    alt="Feature"
                    className="w-full h-[300px] object-cover rounded-t-lg select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
