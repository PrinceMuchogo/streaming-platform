import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const find_store = await prisma.store.findUnique({
      where: {
        id: params.id,
      },
      include: {
        products: {
          include: {
            productImage: true
          }
        },
      },
    });



    if (find_store) {
      return new Response(JSON.stringify(find_store), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Store Not Found" }), {
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
