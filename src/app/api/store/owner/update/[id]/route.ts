import { v2 as cloudinary } from "cloudinary";
import prisma from "@/utils/dbconfig";
import { Product } from "@/types/product";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const storeLogo = formData.get("storeLogo") as File;
    const productImages = formData.getAll("productImages") as File[];

    const productsString = formData.get("products") as string;
    const products = JSON.parse(productsString);


    console.log('products: ', products)

    if (productImages) {
      //   productImages.map((image, index)=>{
      //     console.log("product image file: ", image.file);
      //     console.log("product image uid: ", image.uniqueId);
      // })
     // console.log("products: ", productImages);
    }

    const find_store = await prisma.store.findUnique({
      where: {
        storeName: formData.get("storeName") as string,
      },
    });

    // if (find_store) {
    //   return new Response(JSON.stringify({ message: "store exists" }), {
    //     status: 400,
    //   });
    // }

    // upload store logo to cloudinary
    if (!storeLogo) {
      console.log("No file provided.");
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
      });
    }
    const arrayBuffer = await storeLogo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bufferSize = buffer.length;

    const uploadStoreLogoResult = await new Promise((resolve, reject) => {
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

    const store = {
      storeName: formData.get("storeName") as string,
      storeOwnerID: formData.get("storeOwnerID") as string,
      storeLogo: (uploadStoreLogoResult as any)?.secure_url,
      imagePublicID: (uploadStoreLogoResult as any)?.public_id,
    };

    const new_store = await prisma.store.create({ data: store });

    if (new_store) {
      

      await Promise.all(
        productImages.map(async (product: File) => {
          //upload product image
          if (!product) {
            console.log("No productImage provided.");
            return new Response(
              JSON.stringify({ message: "No file provided" }),
              {
                status: 400,
              },
            );
          }
          const arrayBuffer = await product.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const bufferSize = buffer.length;

          const uploadStoreLogoResult = await new Promise((resolve, reject) => {
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

          const productImage = {
            productImageID: product.name,
            productImage: (uploadStoreLogoResult as any)?.secure_url,
            imagePublicID: (uploadStoreLogoResult as any)?.public_id,
          };

          await prisma.productImage.create({ data: productImage });
        }),
      );

      await Promise.all(
        products.map(async (product: Product) => {
          console.log('product before saving: ', product.productImageID)
          const new_product = await prisma.product.create({
            data: {
              productName: product.productName!,
              description: product.description!,
              quantity: product.quantity!,
              price: product.price!,
              storeId: new_store.id!,
              productImageID: product.productImageID!,
            },
          });
        }),
      );
    }

    // Return the processed data
    return new Response(JSON.stringify({ message: "done" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
