import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations/auth.validation"
import { UserRole } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Get role from request, default to PATIENT if not provided
    const userRole = (body.role?.toUpperCase() || 'PATIENT') as UserRole

    // Validate role is one of the allowed values
    if (!['PATIENT', 'DOCTOR', 'ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    console.log('📝 Registering user with role:', userRole)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user with the specified role
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        dateOfBirth: validatedData.dateOfBirth,
        role: userRole,  // ✅ Use role from request
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    // Check for Prisma/database errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    if (error.message?.includes("Can't reach database server") ||
      error.message?.includes("P1001") ||
      error.message?.includes("connection")) {
      return NextResponse.json(
        {
          error: "Database connection error. Please check your DATABASE_URL environment variable.",
          details: process.env.NODE_ENV === "development" ? error.message : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}


