import prisma from "@/utils/dbconfig"

interface Params{
    userId: string,
    videoId: string
}

export async function POST(req:Request){
    try {
        // get userId and videoId from params
        const { userId, videoId } = await req.json()

        // Make db operation
        const bookmark_video = await prisma.favourite_videos.create({
            data: {
                userID: userId,
                videoID: videoId
            }
        })

        // Send Response
        return new Response (JSON.stringify({
            messsage: 'Success!'
        }),{
            status: 200
        })

    } catch (error) {
        return new Response(JSON.stringify({
            message: "Error bookmarking video!"
        }), {
            status: 500
        })
    }
}


// Logic for unbooking a video

export async function DELETE(req:Request){

    try {
        const {userId, videoId} = await req.json()

    await prisma.favourite_videos.deleteMany({
        where: {
            userID: userId,
            videoID: videoId
        }
    })

    return new Response(JSON.stringify({message: 'Bookmark removed succesfully'}), {
        status: 200
    })

    } catch (error) {
        console.error('Error removing bookmark:', error);
        return new Response(JSON.stringify({ message: 'Failed to remove bookmark!' }), {
            status: 500,
        });
    }
    
}