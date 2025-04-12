// api/get-video/ [id]

import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const id = params.id;

    const videos = await prisma.favourite_videos.findMany({
      where: {
        userID: id,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (videos) {
      const videoIds = videos.map((video) => video.id);
      const favVideos = await prisma.video.findMany({
        where: {
          id: { in: videoIds },
        },
      });

      if (favVideos) {
        return new Response(JSON.stringify(favVideos), { status: 200 });
      }else{
        return new Response(JSON.stringify({message: "No favourite videos found"}), { status: 200 });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
