import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log("[Mobile-Login] Request received for:", email);

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        // Authenticate directly using the same logic as the authorize function
        const user = await prisma.user.findUnique({
            where: { email: email as string },
        });

        if (!user || !user.password) {
            console.log("[Mobile-Login] User not found or no password");
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password as string, user.password);

        if (!isPasswordValid) {
            console.log("[Mobile-Login] Invalid password");
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // For mobile, we'll return a simple session token (the user ID encoded)
        // In a production app, you'd want to use proper JWT signing
        const sessionToken = Buffer.from(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            timestamp: Date.now()
        })).toString('base64');

        console.log("[Mobile-Login] Success for:", email);

        return NextResponse.json({
            success: true,
            token: sessionToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
            }
        });

    } catch (error: any) {
        console.error("[Mobile-Login] Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
