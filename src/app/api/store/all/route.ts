import prisma from "@/utils/dbconfig";

export async function GET(request: Request) {
  try {
    const find_stores = await prisma.store.findMany();

    if (find_stores) {
      return new Response(JSON.stringify(find_stores), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Stores Not Found" }), {
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
