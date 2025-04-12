import prisma from "@/utils/dbconfig";


export async function GET(req: Request, res:Response){
    try {
        // Fetch all videos from the db
        const videos = await prisma.video.findMany({
            include: {
                videoComments: true,
                favourite_videos: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const products = await prisma.product.findMany({
            include: {
                productImage: true,
            },
        });

       return new Response(JSON.stringify(videos), { 
            status: 200,
       });
    } catch (error) {
        console.log("error: ", error)
        return new Response(JSON.stringify({ message: error}), {
            status: 500,
          });
    }
}