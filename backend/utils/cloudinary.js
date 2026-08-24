import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadProfileImageBuffer = (buffer, { publicIdPrefix = "participant" } = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "sih/profile-images",
        public_id: `${publicIdPrefix}-${Date.now()}`,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // Use secure_url, never the plain http url.
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

// ==========================================
// DELETE PROFILE IMAGE (rollback on failed signup/team create)
// ==========================================

const deleteProfileImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Don't let a cleanup failure crash the request —
    // just log it, an orphaned image isn't worth failing the response for.
    console.error("Failed to delete Cloudinary image:", publicId, error.message);
  }
};

export default cloudinary;
export { uploadProfileImageBuffer, deleteProfileImage };