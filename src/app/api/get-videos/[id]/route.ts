import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {

    const subscribedPackage = await prisma.subscription.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!subscribedPackage) {
      const videos = await prisma.video.findMany({
        // where: {
        //   package: subscribedPackage.packageId,
        // },
        include: {
          videoComments: true,
          favourite_videos: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      if (videos) {
        return new Response(JSON.stringify(videos), {
          status: 200,
        });
      }
    }else{
      return new Response(JSON.stringify({message: "No content found"}), {
        status: 200,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
