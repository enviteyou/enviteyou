/**
 * Compresses an image file to a maximum size of 20 KB.
 * If the image is already less than 20 KB, it returns the original file.
 * Otherwise, it uses a canvas to resize the image and adjust its quality.
 *
 * @param {File} file The original image file.
 * @returns {Promise<File>} A promise that resolves to the compressed File object.
 */
export async function compressImageToMax20KB(file) {
  // If the file is not an image, return it as-is
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Target size is 20 KB (20,480 bytes)
  const TARGET_SIZE = 20 * 1024;

  // If the file is already under 20 KB, no need to compress
  if (file.size <= TARGET_SIZE) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        let width = img.width;
        let height = img.height;

        // Set initial maximum dimension to 800px to speed up compression and fit in 20kb
        let maxDimension = 800;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let quality = 0.7;
        let blob = null;
        let attempts = 0;

        // Loop to reduce quality and resolution until size is <= 20 KB or max 8 attempts
        while (attempts < 8) {
          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, width, height);

          // Draw white background (especially for transparent PNGs)
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);

          blob = await new Promise((resBlob) => {
            canvas.toBlob((b) => resBlob(b), "image/jpeg", quality);
          });

          if (!blob) break;

          if (blob.size <= TARGET_SIZE) {
            break;
          }

          // If still larger than 20 KB, reduce parameters
          if (quality > 0.2) {
            quality -= 0.15; // lower quality first
          } else {
            // Quality is already low, reduce dimensions significantly
            width = Math.round(width * 0.7);
            height = Math.round(height * 0.7);
            quality = 0.5; // reset quality slightly higher for the lower resolution
          }
          attempts++;
        }

        if (blob) {
          // Re-create the File object preserving the original name and type (as jpeg)
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
