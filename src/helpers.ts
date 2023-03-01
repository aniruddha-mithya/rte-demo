import axios from "axios";

export const upload = async (
  pictureObject: { base64: string; name: string } & Record<string, unknown>,
  fileName?: string,
  folderName?: string,
  setProgress?: (progress: number) => any
) => {
  const { base64, name } = pictureObject;
  const res = await axios
    .request<Picture>({
      url: "pictures/upload",
      data: {
        base64img: base64,
        filename: fileName || name,
        folder: folderName || "default",
      },
      method: "POST",
    })
    .catch((error) => {
      throw error;
    });
  return res;
};

export type Picture = {
  id?: string;
  height?: number;
  width?: number;
  imagePath?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  url?: string;
  name?: string;
  caption?: string;
  source?: string;
  fileType?: "image";
};
