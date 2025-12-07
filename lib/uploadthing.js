import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  catatanImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete!");
      // Gunakan ufsUrl (baru) atau url (deprecated)
      const fileUrl = file.ufsUrl || file.url;
      console.log("File URL:", fileUrl);
      return { url: fileUrl };
    }),
};
