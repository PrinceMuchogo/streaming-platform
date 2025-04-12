import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  try {
    const data = await request.json();

    const videoID = params.id;

    if(data.userID == null){
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    const video = await prisma.video.findUnique({
      where: {
        id: videoID,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email: data.userID,
      },
    });

    if (video && user) {
      const like = await prisma.like.findFirst({
        where: {
          videoID: videoID,
          userID: user.id,
        },
      });

      if (like) {
        await prisma.video.update({
          where: {
            id: videoID,
          },
          data: {
            likes: video.likes! - 1,
          },
        });
        await prisma.like.delete({
          where: {
            id: like.id,
          },
        });

      } else {
        await prisma.video.update({
          where: {
            id: videoID,
          },
          data: {
            likes: video.likes! + 1,
          },
        });
        await prisma.like.create({
          data: {
            videoID: videoID,
            userID: user.id,
          },
        });
        
      }
    }

    return new Response(JSON.stringify({ message: "Like added" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
