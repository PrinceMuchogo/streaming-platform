import { v2 as cloudinary } from "cloudinary";
import prisma from "@/utils/dbconfig";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    const formData = await req.formData();
    const file = formData.get("image") as File;

    const find_store_owner = await prisma.storeOwner.findUnique({
      where: {
        nationalID: formData.get("nationalID") as string,
      },
    });

    if (find_store_owner) {
      return new Response(JSON.stringify({ message: "Store owner exists" }), {
        status: 400,
      });
    }

    if (!file) {
      console.log("No file provided.");
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
      });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bufferSize = buffer.length;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image", 
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      let uploadedBytes = 0;

      uploadStream.on("data", (chunk) => {
        uploadedBytes += chunk.length;
        const progress = (uploadedBytes / bufferSize) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
      });

      uploadStream.on("finish", () => {
        console.log("Upload finished.");
      });

      uploadStream.end(buffer);
    });

    console.log("Upload result:", uploadResult);
    let new_image;

    const storeOwner = {
      name: formData.get("name") as string,
      mobile: formData.get("mobile") as string,
      address: formData.get("address") as string,
      nationalID: formData.get("nationalID") as string,
      accountNumber: formData.get("accountNumber") as string,
      creditCardSecurityKey: formData.get("creditCardSecurityKey") as string,
      status: "PENDING",
      image: (uploadResult as any)?.secure_url,
      imagePublicID: (uploadResult as any)?.public_id,
    };

    console.log("store owner: ", storeOwner);

    const new_store_owner = await prisma.storeOwner.create({
      data: storeOwner,
    });

    // Return the processed data
    return new Response(JSON.stringify({ message: "Store owner added" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}