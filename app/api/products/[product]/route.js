import database from "../../../utils/database.js"
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {


    const { product } = params

    let c = await database.getProduct(product)

    if (c.status) {
        return new NextResponse(
            JSON.stringify({ "success": true, product: c.product }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }
}

export async function DELETE(req, { params }) {
    const { product } = params
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId")

    let c = await database.deleteProduct(product, sessionId)

    if (c.status) {
        return new NextResponse(
            JSON.stringify({ "success": true }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }
}