const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1024;

export const resizeImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error("Fotoğraf boyutu çok büyük"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height *= MAX_IMAGE_DIMENSION / width;
            width = MAX_IMAGE_DIMENSION;
          } else {
            width *= MAX_IMAGE_DIMENSION / height;
            height = MAX_IMAGE_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size > MAX_IMAGE_SIZE) {
                reject(
                  new Error("Resim boyutlandırıldıktan sonra bile çok büyük")
                );
              } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
                reader.readAsDataURL(blob);
              }
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          0.7
        );
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
