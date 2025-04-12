import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const find_storeOwner = await prisma.storeOwner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (find_storeOwner) {
      return new Response(JSON.stringify(find_storeOwner), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Store owner Not Found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
