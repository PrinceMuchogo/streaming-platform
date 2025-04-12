export async function GET() {
    return new Response('This endpoint only supports POST requests.', { status: 405 });
  }
  
  export async function POST(req: Request) {
    try {
      const { transaction_id, status } = await req.json();
  
      if (status === 'SUCCESS') {
  
        return new Response('Payment successful', { status: 200 });
      } else {
  
        return new Response('Payment failed', { status: 400 });
      }
    } catch (error) {
      return new Response('Error processing request', { status: 500 });
    }
  }
  