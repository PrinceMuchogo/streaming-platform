import { Order } from "@/types/order";
import { Product } from "@/types/product";
import prisma from "@/utils/dbconfig";
const { Pesepay } = require("pesepay");

const pesepay = new Pesepay(
  process.env.NEXT_PUBLIC_PESEPAY_INTEGRATION_KEY,
  process.env.NEXT_PUBLIC_PESEPAY_ENCRYPTION_KEY,
);

pesepay.resultUrl = "http://localhost:3000/payment-callback";
pesepay.returnUrl = "http://localhost:3000/store/checkout";

const baseUrl = "http://localhost:3000";

export async function POST(req: Request) {
  try {
    // Parse the request formdata
    const formData = await req.formData();
    const productsString = formData.get("products") as string;
    const products = JSON.parse(productsString);

    const orderData = {
      amount: formData.get("amount") as string,
      userID: formData.get("userId") as string,
      status: "PENDING",
      storeID: formData.get("storeId") as string,
    };

    const order = {
      amount: formData.get("amount") as string,
      bankAccount: formData.get("bankAccount") as string,
      cardNumber: formData.get("cardNumber") as string,
      cvv: formData.get("cvv") as string,
      description: formData.get("description") as string,
      email: formData.get("email") as string,
      expiryDate: formData.get("expiryDate") as string,
      phone: formData.get("mobileNumber") as string,
      reference: formData.get("reference") as string,
      paymentMethod: formData.get("paymentMethod") as string,
      userId: formData.get("userId") as string,
      storeID: formData.get("storeId") as string,
    };

    console.log("order details: ", order);

    // Validate required fields
    if (
      !order.email ||
      !order.phone ||
      !order.amount ||
      !order.reference ||
      !order.description ||
      !order.paymentMethod
    ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 },
      );
    }

    const newOrder = await prisma.order.create({
      data: orderData,
    });

    if (newOrder) {
      await Promise.all(
        products.map(async (product: Product) => {
          const new_product = await prisma.orderProducts.create({
            data: {
              orderID: newOrder.id!,
              productID: product.id!,
            },
          });
        }),
      );
    }

    // Send the request to Paynow
    const transaction = pesepay.createTransaction(
      Number(order.amount),
      "USD",
      "pesepay payment",
      order.reference,
    );
    const response = await pesepay.initiateTransaction(transaction);

    if (!response.success) {
      throw new Error(response.message || "Transaction initiation failed");
    }

    const { redirectUrl, referenceNumber, pollUrl } = response;
    if (!redirectUrl || !referenceNumber) {
      throw new Error("Missing redirect URL or reference number");
    }
    // Start the payment status check in the background
    checkPaymentStatus(referenceNumber, pollUrl, newOrder.id, order)
      .then(async (status) => {
        console.log(`Final payment status for ${referenceNumber}:`, status);
        await prisma.order.update({
          where: {
            id: newOrder.id,
          },
          data: {
            status: status.status,
          },
        });
      })
      .catch((error) => {
        console.error(
          `Error in background payment check for ${referenceNumber}:`,
          error,
        );
      });

    return new Response(
      JSON.stringify({
        redirectUrl,
        referenceNumber,
        pollUrl,
        message:
          "Redirect URL generated successfully. Payment status will be checked in the background.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

async function checkPaymentStatus(
  reference: string,
  pollUrl: string,
  orderID: string,
  order: Order,
  maxAttempts = 10,
  baseInterval = 5000,
) {
  console.log(
    `Starting payment status check for reference: ${reference}, pollUrl: ${pollUrl}`,
  );

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = pollUrl
        ? await pesepay.pollTransaction(pollUrl)
        : await pesepay.checkPayment(reference);

      console.log(
        `Payment status response (attempt ${attempt + 1}):`,
        response,
      );

      if (response.success && response.paid) {
        console.log("Payment successful for reference:", reference);
        await prisma.payment.create({
          data: {
            userID: order.userID,
            amount: Number(order.amount),
            paymentStatus: "PAID",
            paymentMethod: order.paymentMethod,
            orderId: orderID,
          },
        });

        return { status: response.success, message: "Payment done" };
      } else if (response.status === "FAILED") {
        console.error("Payment failed for reference:", reference);
        await prisma.payment.create({
          data: {
            userID: order.userID,
            amount: Number(order.amount),
            paymentStatus: "FAILED",
            paymentMethod: order.paymentMethod,
            orderId: orderID,
          },
        });
        return { status: "failed", message: "Payment failed" };
      }
    } catch (error) {
      console.error(
        `Error on payment status check (attempt ${attempt + 1}):`,
        error,
      );
    }

    const delay = baseInterval * Math.pow(2, attempt);
    console.log(`Retrying in ${delay / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.error(
    `Payment status check timed out after ${maxAttempts} attempts for reference: ${reference}`,
  );
  return { status: "timeout", message: "Payment status check timed out" };
}
