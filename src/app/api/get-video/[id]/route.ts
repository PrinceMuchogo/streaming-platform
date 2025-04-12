// api/get-video/ [id]

import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}


export async function GET(request: Request,  { params }: { params: Params }) {
  try {
    // get a single video
    const id = params.id;

    // query the database
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
      include: {
        videoComments: true,
      }
    });

    if (video) {
      // console.log("details: ", video);
      return new Response(JSON.stringify(video), {
        status: 200,
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
