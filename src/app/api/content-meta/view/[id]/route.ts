import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  try {
    const videoID = params.id;
    const view = await request.json();

    const video = await prisma.video.findUnique({
      where: {
        id: videoID,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email: view.userID,
      },
    });

    let viewDB: any;
    //check if video exists
    if (video) {
      //check if both user and video exists
      if (user && video) {
        viewDB = await prisma.view.findFirst({
          where: {
            videoID: videoID,
            userID: user.id,
          },
        });

        if (viewDB) {
          console.log("video already viewed");
          return new Response(
            JSON.stringify({ message: "video already viewed" }),
            {
              status: 200,
            },
          );
        } else {
          await prisma.view.create({
            data: {
              videoID: videoID,
              userID: user?.id,
            },
          });
          await prisma.video.update({
            where: {
              id: videoID,
            },
            data: {
              views: video.views! + 1,
            },
          });
        }
      }
    }

    return new Response(JSON.stringify({ message: "view saved" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
