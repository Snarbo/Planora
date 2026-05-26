import { useCallback, useState } from "react";

type UseImageUploadOptions = {
  size?: number;
  quality?: number;
};

export const useImageUpload = (options?: UseImageUploadOptions) => {
  const { size = 45, quality = 1 } = options || {};
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const compressToSquare = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas not supported");

          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.drawImage(
            img,
            sx,
            sy,
            minSide,
            minSide,
            0,
            0,
            size,
            size
          );

          const output = canvas.toDataURL("image/jpeg", quality);

          resolve(output);
        };

        img.onerror = reject;
        img.src = event.target?.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      setUploadError(null);
      setUploadLoading(true);

      try {
        const ALLOWED_TYPES = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (!file.type.startsWith("image/")) {
          throw new Error("File must be an image");
        }

        // must be supported format
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(
            "Only JPG, PNG, or WebP images are allowed"
          );
        }

        const result = await compressToSquare(file);

        setUploadLoading(false);
        return result;
      } catch (err: any) {
        setUploadError(err.message || "Upload failed");
        setUploadLoading(false);
        return null;
      }
    },
    [size, quality]
  );

  return {
    uploadImage,
    uploadLoading,
    uploadError,
  };
};