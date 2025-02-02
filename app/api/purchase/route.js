import database from "../../utils/database.js"
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const { searchParams } = new URL(req.url);
    console.log(searchParams.get("sessionId"))
    const sessionId = searchParams.get("sessionId");

    let data = await req.json()

    //simulate purchase
    let canPurchase = await checkCardDetails(data.cardNumber, data.expDate, data.CVV)

    if (canPurchase) {
        let purchase = await database.addPurchase(data, sessionId)
        if (purchase.status) {
            return new NextResponse(
                JSON.stringify({ "success": true, orderNumber: purchase.orderNumber }),
                { status: 200 }
            )
        } else {
            return new NextResponse(
                JSON.stringify({ "success": false }),
                { status: 401 }
            )
        }
    } else {
        return new NextResponse(
            JSON.stringify({ "success": false, message: "Your credit card details are incorrect. Please try again!" }),
            { status: 401 }
        )
    }
}

//Inside of this function is the dummy card checker, in the real world this would be replaced with a payment processor such as Stripe
const checkCardDetails = (cardNo, expDate, CVV) => {
    if (cardNo == "4242424242424242" && expDate == "12/34" && CVV == "987") {
        return true;
    } else {
        return false;
    }
}