import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { prisma } from "@/lib/prisma"
import { updateUserSchema } from "@/lib/validations/user.validation"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true, // NextAuth uses 'image', schema uses 'avatar' - need to check mapping or use avatar
                avatar: true,
                phone: true,
                dateOfBirth: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error: any) {
        console.error("Error fetching profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const validatedData = updateUserSchema.parse(body)

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: validatedData,
        })

        return NextResponse.json(user)
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: error.errors,
                },
                { status: 400 }
            )
        }

        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
