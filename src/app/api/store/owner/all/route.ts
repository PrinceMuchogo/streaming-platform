import prisma from "@/utils/dbconfig";


export async function GET(req: Request, res:Response){
    try {
        // Fetch all owners from the db
        const owners = await prisma.storeOwner.findMany();

        console.log("owners: ", owners)

       return new Response(JSON.stringify(owners), { 
            status: 200,
       });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
          });
    }
}