import { v2 as cloudinary } from "cloudinary";
import prisma from "@/utils/dbconfig";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const storeID = formData.get("storeID") as string;
  const caption = formData.get("caption") as string;
  const userEmail = formData.get("user") as string;
  const videoName = formData.get("videoName") as string;


  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  let userID: string = "";

  if(user){
    userID = user.id;
  
  }else{
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  


  if (!file) {
    console.log("No file provided.");
    return new Response(JSON.stringify({ message: "No file provided" }), {
      status: 400,
    });
  }

  const videoExists = await prisma.video.findUnique({
    where: {
      video_name: file.name,
    },
  });

  if (videoExists) {
    console.log("Video already exists.");
    return new Response(JSON.stringify({ message: "Video already exists" }), {
      status: 400,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const bufferSize = buffer.length;

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
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
    let new_video;

    if (!videoExists) {
       new_video = await prisma.video.create({
        data: {
          video_name: videoName || file.name,
          userID,
          caption,
          storeID: storeID? storeID : null,
          url: (uploadResult as any)?.secure_url,
          video_public_ID: (uploadResult as any)?.public_id,
        },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Upload successful !!",
        data: new_video,
      }),
      { status: 200 },
    );
  } catch (error: unknown) {
    let errorMessage = "Network Error Try Again!";
    let statusCode = 500;
  
    if (error instanceof Error) {
      const cloudinaryError = error as { http_code?: number; message?: string };
  
      // Check for specific Cloudinary error codes
      if (cloudinaryError.http_code) {
        statusCode = cloudinaryError.http_code;
  
        switch (cloudinaryError.http_code) {
          case 400:
            errorMessage = "Bad Request: Invalid input or missing data.";
            break;
          case 401:
            errorMessage = "Unauthorized: Invalid API credentials.";
            break;
          case 403:
            errorMessage = "Forbidden: You don't have permission to upload this video.";
            break;
          case 404:
            errorMessage = "Not Found: The requested resource could not be found.";
            break;
            case 499:
              errorMessage = "Network error. Please try again later.";
              break;
          case 500:
            errorMessage = "Cloudinary server error. Please try again later.";
            break;
          default:
            errorMessage = cloudinaryError.message || "An unknown error occurred.";
        }
      } else if (cloudinaryError.message?.includes("network")) {
        // Handle network-related errors
        errorMessage = "Network Error: Please check your internet connection.";
        statusCode = 502; 
      } else {
        errorMessage = cloudinaryError.message || errorMessage;
      }
    }
  
    console.error("Error details: ", error);
  
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: statusCode,
    });
  }
}
