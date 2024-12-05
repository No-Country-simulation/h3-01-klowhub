import cloudinary from "../config/cloudinary";
import fs from "fs";
import path from "path";

export const uploadToCloudinary = async (localFilePath: string, filename: string) => {
  try {
      var folder = "KlowHub-api";
      var filePathOnCloudinary = folder + "/" + path.parse(filename).name;
      const result = await cloudinary.uploader.upload(localFilePath, {
        public_id: filePathOnCloudinary,
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
  } catch (error) {
      console.log(error);
      return { message: "Error al subir a Cloudinary" };
  } finally {
      await fs.promises.unlink(localFilePath);
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error al eliminar de Cloudinary:", error);
    throw new Error("Error al eliminar la imagen de Cloudinary");
  }
};
