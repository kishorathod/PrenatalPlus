import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication Check (Consistent with other mobile endpoints)
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.substring(7);
        try {
            // Just verify it's a valid base64 JSON (our custom mobile token)
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            JSON.parse(decoded);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // 2. Parse Multipart Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log("[Mobile-Upload] Received file:", file.name, file.size, file.type);

        // 3. Upload to UploadThing using UTApi
        const utapi = new UTApi();
        const response = await utapi.uploadFiles(file);

        if (response.error) {
            console.error("[Mobile-Upload] UploadThing error:", response.error);
            return NextResponse.json({ error: "Upload failed", details: response.error }, { status: 500 });
        }

        // 4. Return the file data
        // In v6, uploadFiles returns an object or array depending on input
        // Single file upload returns a single object { data, error }
        const uploadedFile = response.data;

        if (!uploadedFile) {
            return NextResponse.json({ error: "Upload failed: No data returned" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            fileUrl: uploadedFile.url,
            fileName: uploadedFile.name,
            fileKey: uploadedFile.key,
            fileSize: uploadedFile.size,
            mimeType: file.type || 'application/octet-stream'
        });

    } catch (error: any) {
        console.error("[Mobile-Upload] Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
