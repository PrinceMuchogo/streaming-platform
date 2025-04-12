import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
  userId: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  try {
    const data = await request.json();

    const videoID = params.id;

    const video = await prisma.video.findUnique({
      where: {
        id: videoID,
      },
    });

    if (video) {
      await prisma.comment.create({
        data: {
          comment_text: data.comment,
          videoID: videoID,
          // userID: comment.userID,
          userID: data.userId,
        },
      });
    }

    // Return the updated videos
    const videos = await prisma.video.findMany({
      include: {
        videoComments: true,
        user: true,
      },
    });

    // return new Response(JSON.stringify({message: "comment saved"}), {
    //   status: 200,
    // });

    return new Response(
      JSON.stringify({
        message: "Comment saved!",
        videos: videos,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    // Get all the comments for a particlular video
    const videoId = params.id;

    // check if video exists in the database
    const videoExists = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    if (videoExists) {
      const comments = await prisma.comment.findMany({
        where: {
          videoID: videoId,
        },
        include: {
          user: true,
          commentReplies: true,
          commentLikes: true,
        },
      });

      console.log("tHE COMMENTS");
      console.log(comments);

      return new Response(JSON.stringify(comments), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Error Fetching Comments!" }),
      {
        status: 500,
      },
    );
  }
}
