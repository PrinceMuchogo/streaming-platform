import prisma from "@/utils/dbconfig";

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const find_product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        productImage: true,
        reviews: true,
        store: true,
        ratings: true
      },
    });



    if (find_product) {
      return new Response(JSON.stringify(find_product), {
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
