import { useRef, useState } from "react";
import axios from "axios";
import { Loader2Icon, Star, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

async function uploadImageFile(file) {
  const data = new FormData();
  data.append("my_file", file);

  const response = await axios.post(
    "http://localhost:5000/api/admin/products/upload-image",
    data,
  );

  if (response?.data?.success) {
    return response.data.result.secure_url || response.data.result.url || "";
  }

  throw new Error("Upload failed");
}

function ImageDropzone({
  label,
  description,
  imageUrl,
  isUploading,
  disabled,
  onPickFile,
  onRemove,
  required = false,
}) {
  const inputRef = useRef(null);

  return (
    <div className="space-y-2">
      <div>
        <Label>
          {label}
          {required ? " *" : ""}
        </Label>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="rounded-lg border-2 border-dashed p-4">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || isUploading}
          onChange={onPickFile}
        />

        {!imageUrl ? (
          <button
            type="button"
            onClick={() => !disabled && !isUploading && inputRef.current?.click()}
            className={`flex h-36 w-full flex-col items-center justify-center ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2Icon className="h-6 w-6 animate-spin" />
                <span>Uploading image...</span>
              </div>
            ) : (
              <>
                <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <span>Click to upload {required ? "main image" : "images"}</span>
              </>
            )}
          </button>
        ) : (
          <div className="relative overflow-hidden rounded-lg border">
            <img
              src={imageUrl}
              alt={label}
              className="h-40 w-full object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 bg-white/90 hover:bg-white"
              onClick={onRemove}
              disabled={disabled || isUploading}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductImagesUpload({
  mainImage = "",
  subImages = [],
  onMainImageChange,
  onSubImagesChange,
  disabled = false,
}) {
  const subInputRef = useRef(null);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingSub, setIsUploadingSub] = useState(false);

  async function handleMainFileSelected(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    try {
      const url = await uploadImageFile(file);
      onMainImageChange(url);
    } catch (error) {
      console.error("Main image upload failed:", error);
    } finally {
      setIsUploadingMain(false);
      event.target.value = "";
    }
  }

  async function handleSubFilesSelected(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploadingSub(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadImageFile(file);
        if (url && url !== mainImage && !subImages.includes(url)) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        onSubImagesChange([...subImages, ...uploadedUrls]);
      }
    } catch (error) {
      console.error("Sub image upload failed:", error);
    } finally {
      setIsUploadingSub(false);
      if (subInputRef.current) {
        subInputRef.current.value = "";
      }
    }
  }

  function handleRemoveSubImage(index) {
    onSubImagesChange(subImages.filter((_, imageIndex) => imageIndex !== index));
  }

  function handleSetAsMain(url) {
    if (!url) return;

    const remainingSubs = subImages.filter((image) => image !== url);
    if (mainImage && mainImage !== url && !remainingSubs.includes(mainImage)) {
      remainingSubs.unshift(mainImage);
    }

    onMainImageChange(url);
    onSubImagesChange(remainingSubs.filter((image) => image !== url));
  }

  return (
    <div className="space-y-8">
      <ImageDropzone
        label="Main Image"
        description="Primary image shown first in the product gallery."
        imageUrl={mainImage}
        isUploading={isUploadingMain}
        disabled={disabled}
        onPickFile={handleMainFileSelected}
        onRemove={() => onMainImageChange("")}
        required
      />

      <div className="space-y-3">
        <div>
          <Label>Sub Images</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Additional gallery images shown as thumbnails below the main image.
          </p>
        </div>

        <div className="rounded-lg border-2 border-dashed p-4">
          <Input
            ref={subInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={disabled || isUploadingSub}
            onChange={handleSubFilesSelected}
          />

          <button
            type="button"
            onClick={() =>
              !disabled && !isUploadingSub && subInputRef.current?.click()
            }
            className={`flex h-28 w-full flex-col items-center justify-center ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {isUploadingSub ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2Icon className="h-6 w-6 animate-spin" />
                <span>Uploading sub images...</span>
              </div>
            ) : (
              <>
                <UploadCloudIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                <span>Click to upload sub images</span>
              </>
            )}
          </button>
        </div>

        {subImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {subImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative overflow-hidden rounded-lg border"
              >
                <img
                  src={image}
                  alt={`Sub image ${index + 1}`}
                  className="h-28 w-full object-cover"
                />
                <div className="absolute left-2 top-2 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 bg-white/90 px-2 text-xs hover:bg-white"
                    onClick={() => handleSetAsMain(image)}
                    disabled={disabled}
                  >
                    <Star className="mr-1 h-3 w-3" />
                    Set main
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={() => handleRemoveSubImage(index)}
                  disabled={disabled}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImagesUpload;
