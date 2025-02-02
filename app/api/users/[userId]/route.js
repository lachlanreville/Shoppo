import database from "../../../utils/database.js"
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(req, { params }) {
    const { userId } = params

    let c = await database.getUser(userId)

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

export async function PATCH(req, { params }) {
    const { userId } = params
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId")
    let data = req.json();

    let ree = await cloudinary.uploader.upload(data.raw, {
        folder: 'profiles',
        resource_type: 'image'
    });
    data.profileImage = ree.url;

    let c = await database.updateUser(userId, sessionId, data)

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