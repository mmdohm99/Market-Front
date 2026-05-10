import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
  reorderFeatureImages,
} from "@/store/common-slice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [orderedImages, setOrderedImages] = useState([]);

  // Drag state
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

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
  }, [dispatch]);

  return (
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
  );
}

export default AdminDashboard;
