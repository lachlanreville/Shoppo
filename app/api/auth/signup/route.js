import database from "../../../utils/database.js"
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const body = await req.json();
    const { email, displayName, password } = body

    let c = await database.signup(email, displayName, password)

    if (c.status) {
        return new NextResponse(
            JSON.stringify({ "success": true, sessionToken: c.sessionToken }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }
}