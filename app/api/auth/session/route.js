import database from "../../../utils/database.js"
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export async function POST(req, res) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId")

    const data = await req.json()

    let newImage = "";

    if (!sessionId) {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }

    if (data.image.raw !== "") {
        let ree = await cloudinary.uploader.upload(data.image.raw, {
            folder: 'profiles',
            resource_type: 'image'
        });

        newImage = ree.url
    }
    data.image = newImage !== "" ? newImage : data.image.preview;

    let c = await database.updateUser(sessionId, data)

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

export async function GET(req, res) {
    const { searchParams } = new URL(req.url);

    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }

    let c = await database.getSessionData(sessionId)
    if (c.status) {
        return new NextResponse(
            JSON.stringify({ "success": true, user: c.user }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "success": false }),
            { status: 400 }
        )
    }
}