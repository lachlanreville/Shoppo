import database from "../../utils/database.js"
import { NextResponse } from 'next/server';

export async function GET(req, res) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId")
    let c = {}
    if (categoryId) {
        c = await database.getProductsByCategory(categoryId)

    } else {
        c = await database.getAllProducts()
    }

    if (c.status) {
        return new NextResponse(
            JSON.stringify({ "success": true, products: c.products }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }
}