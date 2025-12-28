import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPregnancySchema = z.object({
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    bloodType: z.string().optional(),
    rhFactor: z.string().optional(),
    height: z.number().positive().optional(),
    prePregnancyWeight: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication Check (Bearer Token)
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.substring(7);
        let userData;
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            userData = JSON.parse(decoded);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = userData.userId;

        // 2. Validate Body
        const body = await req.json();
        const validatedData = createPregnancySchema.parse(body);

        // 3. Prevent duplicate active pregnancies
        const activePregnancy = await prisma.pregnancy.findFirst({
            where: {
                userId,
                status: "ACTIVE",
            },
        });

        if (activePregnancy) {
            return NextResponse.json(
                { error: "You already have an active pregnancy tracking session" },
                { status: 400 }
            );
        }

        // 4. Calculate current week
        const today = new Date();
        const startDate = new Date(validatedData.startDate);
        const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(daysDiff / 7);

        // 5. Create Pregnancy
        const pregnancy = await prisma.pregnancy.create({
            data: {
                ...validatedData,
                userId,
                currentWeek: Math.max(0, currentWeek),
                status: "ACTIVE",
            },
        });

        return NextResponse.json(pregnancy, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }

        console.error("[Mobile-Pregnancies] Error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
