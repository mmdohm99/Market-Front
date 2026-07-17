export function getProductMainImage(product) {
  if (product?.image) {
    return product.image;
  }

  if (product?.images?.length > 0) {
    return product.images[0];
  }

  return "";
}

export function getProductSubImages(product) {
  if (product?.subImages?.length > 0) {
    return product.subImages.filter(Boolean);
  }

  const main = getProductMainImage(product);

  if (product?.images?.length > 1) {
    return product.images.slice(1).filter((url) => url && url !== main);
  }

  return [];
}

export function getProductImages(product) {
  const main = getProductMainImage(product);
  const subs = getProductSubImages(product).filter((url) => url !== main);

  if (main) {
    return [main, ...subs];
  }

  if (product?.images?.length > 0) {
    return product.images.filter(Boolean);
  }

  return [];
}

export function buildProductImagePayload(mainImage, subImages = []) {
  const main = mainImage?.trim() || "";
  const subs = subImages.filter(Boolean).filter((url) => url !== main);

  return {
    image: main,
    subImages: subs,
    images: main ? [main, ...subs] : [],
  };
}
