import { FileIcon, UploadCloudIcon, XIcon, Loader2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  onImageUrlChange,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function updateImageUrl(url) {
    setUploadedImageUrl(url);
    onImageUrlChange?.(url);
  }

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    updateImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;

    setImageLoadingState(true);

    try {
      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/products/upload-image`,
        data,
      );

      if (response?.data?.success) {
        const url =
          response.data.result.secure_url || response.data.result.url || "";
        updateImageUrl(url);
      } else {
        setImageFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      setImageFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile) uploadImageToCloudinary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const hasUploadedImage = Boolean(uploadedImageUrl);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile && !hasUploadedImage ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex items-center justify-center h-10 gap-2 text-muted-foreground">
            <Loader2Icon className="w-6 h-6 animate-spin" />
            <span className="text-sm">Uploading image...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {imageFile && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileIcon className="w-8 text-primary mr-2 h-8" />
                  <p className="text-sm font-medium">{imageFile.name}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleRemoveImage}
                  disabled={isEditMode}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove File</span>
                </Button>
              </div>
            )}
            {hasUploadedImage && (
              <img
                src={uploadedImageUrl}
                alt="Upload preview"
                className="h-32 w-full rounded-md object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
