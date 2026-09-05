import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductImages } from "@/lib/product-images";
import {
  Dialog,
  DialogContent,
} from "../ui/dialog";

function ProductImageGallery({ product }) {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setSlideDirection(0);
  }, [product?._id]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        No image available
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  function goToIndex(nextIndex, direction) {
    if (nextIndex === activeIndex) return;
    setSlideDirection(direction);
    setActiveIndex(nextIndex);
    setIsHovering(false);
  }

  function showPrevious() {
    const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    goToIndex(nextIndex, -1);
  }

  function showNext() {
    const nextIndex =
      activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    goToIndex(nextIndex, 1);
  }

  function handleThumbnailClick(index) {
    goToIndex(index, index > activeIndex ? 1 : -1);
  }

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  const slideAnimationClass =
    slideDirection > 0
      ? "animate-slide-in-right"
      : slideDirection < 0
        ? "animate-slide-in-left"
        : "animate-fade-in";

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-background"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          aria-label="Enlarge product image"
        />

        <div
          key={`slide-${activeIndex}-${activeImage}`}
          className={`absolute inset-0 ${slideAnimationClass}`}
        >
          <img
            src={activeImage}
            alt={product?.title}
            className="h-full w-full object-cover will-change-transform"
            style={{
              transform: isHovering ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transition: isHovering
                ? "transform 0.08s ease-out"
                : "transform 0.35s ease-out",
            }}
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:scale-105 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:scale-105 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm text-muted-foreground opacity-90 shadow-md transition group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
          <span>Hover to zoom &amp; click to enlarge</span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                index === activeIndex
                  ? "scale-105 border-pink-500 shadow-md"
                  : "border-border hover:border-pink-300 hover:scale-[1.02]"
              }`}
            >
              <img
                src={image}
                alt={`${product?.title} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-none bg-black/95 p-2 sm:p-4 [&>button.absolute]:hidden">
          <div className="relative flex items-center justify-center">
            <div
              key={`lightbox-slide-${activeIndex}`}
              className={`w-full ${slideAnimationClass}`}
            >
              <img
                src={activeImage}
                alt={product?.title}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              aria-label="Close enlarged image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`lightbox-thumb-${image}-${index}`}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                    index === activeIndex
                      ? "border-pink-500"
                      : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product?.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductImageGallery;
