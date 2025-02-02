import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import database from "../../utils/database.js"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req, res) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId")
    if (!sessionId) {
        return new NextResponse(
            JSON.stringify({ status: false }),
            { status: 401 }
        )
    }
    let request = await req.json();
    let { title, price, description, condition, files, category } = request;
    let imageUrls = [];

    if (!(["Menswear", "Womenswear", "Electronics", "Home Goods"].includes(category))) {
        return new NextResponse(
            JSON.stringify({ "status": false, "message": "No valid category was selected" }),
            { status: 400 }
        )
    }

    if (!(["Used", "New"].includes(condition))) {
        return new NextResponse(
            JSON.stringify({ "status": false, "message": "No valid Condition was selected" }),
            { status: 400 }
        )
    }

    for (let i = 0; i < files.length; i++) {
        let uploadedImage = await uploadImage(files[i])
        imageUrls.push(uploadedImage)
    }

    if (imageUrls.length < 1) {
        return new NextResponse(
            JSON.stringify({ "status": false, "message": "There was no images" }),
            { status: 400 }
        )
    }


    let newProduct = await database.addNewProduct(title, price, description, condition, imageUrls, sessionId, category)

    if (newProduct.status) {
        return new NextResponse(
            JSON.stringify({ "status": true, productId: newProduct.productId }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "status": false }),
            { status: 400 }
        )
    }
}

const uploadImage = async (base64) => {
    let ree = await cloudinary.uploader.upload(base64, {
        folder: 'listings',
        resource_type: 'image'
    });
    return ree.url;
}

export async function PUT(req, res) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId")
    if (!sessionId) {
        return new NextResponse(
            JSON.stringify({ status: false }),
            { status: 401 }
        )
    }

    let request = await req.json();

    let { title, price, description, condition, files, category, id } = request;

    let imageUrls = [];

    if (!(["Menswear", "Womenswear", "Electronics", "Home Goods"].includes(category))) {
        return new NextResponse(
            JSON.stringify({ "status": false, "message": "No valid category was selected" }),
            { status: 400 }
        )
    }

    if (!(["Used", "New"].includes(condition))) {
        return new NextResponse(
            JSON.stringify({ "status": false, "message": "No valid Condition was selected" }),
            { status: 400 }
        )
    }

    for (let i = 0; i < files.length; i++) {
        if (files[i].preview.startsWith("https://") || files[i].preview.startsWith("http://")) {
            imageUrls.push(files[i].preview)
            continue;
        }
        if (files[i].raw !== "") {
            let uploadedImage = await uploadImage(files[i].raw)
            imageUrls.push(uploadedImage)
        }

    }
    if (imageUrls.length < 1) {
        return new NextResponse(
            JSON.stringify({ "status": false, "message": "There was no images" }),
            { status: 400 }
        )
    }
    let newProduct = await database.updateListing(sessionId, id, title, price, description, condition, imageUrls, category)

    if (newProduct.status) {
        return new NextResponse(
            JSON.stringify({ "status": true }),
            { status: 200 }
        )
    } else {
        return new NextResponse(
            JSON.stringify({ "status": false }),
            { status: 400 }
        )
    }
}