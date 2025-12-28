import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import {
  registerSchema,
  doctorRegisterSchema,
  adminRegisterSchema,
  type PatientRegisterInput,
  type DoctorRegisterInput,
  type AdminRegisterInput
} from "@/lib/validations/auth.validation"
import { UserRole } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Get role from request, default to PATIENT if not provided
    const userRole = (body.role?.toUpperCase() || 'PATIENT') as UserRole

    // Validate role is one of the allowed values
    if (!['PATIENT', 'DOCTOR', 'ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    // Dynamic validation based on role
    let validatedData: any

    // We need to parse slightly differently based on the role to ensure we use the right schema
    if (userRole === 'DOCTOR') {
      validatedData = doctorRegisterSchema.parse(body)
    } else if (userRole === 'ADMIN') {
      validatedData = adminRegisterSchema.parse(body)
    } else {
      validatedData = registerSchema.parse(body)
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

    // Prepare user data object based on common fields
    const userData: any = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: userRole,
    }

    // Add role-specific fields
    if (userRole === 'DOCTOR') {
      const doctorData = validatedData as DoctorRegisterInput
      userData.phone = doctorData.phone
      userData.medicalLicenseNumber = doctorData.medicalLicenseNumber
      userData.hospitalClinic = doctorData.hospitalClinic
      userData.yearsOfExperience = doctorData.yearsOfExperience
      userData.specialization = doctorData.specialization

      // Verification Logic
      const providedCode = doctorData.hospitalCode
      const correctCode = process.env.HOSPITAL_ACCESS_CODE

      if (providedCode && correctCode && providedCode === correctCode) {
        userData.isVerified = true
        console.log("✅ Doctor auto-verified with correct hospital code")
      } else {
        userData.isVerified = false
        console.log("⚠️ Doctor registered as unverified (pending approval)")
      }
    } else if (userRole === 'PATIENT') {
      const patientData = validatedData as PatientRegisterInput
      userData.phone = patientData.phone
      userData.dateOfBirth = patientData.dateOfBirth
      // Note: expectedDueDate, emergency contacts etc are likely stored in pregnancy or separate profile update
      // But we can add them here if the User model supported them directly or if we create related records
    } else if (userRole === 'ADMIN') {
      // Admin specific fields if any
    }

    // Create user with the specified role and data
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
      },
    })

    // Auto-create Pregnancy record for patients if due date provided
    if (userRole === 'PATIENT' && validatedData.expectedDueDate) {
      try {
        const dueDate = new Date(validatedData.expectedDueDate)
        if (!isNaN(dueDate.getTime())) {
          // Calculate startDate (LMP) = dueDate - 280 days
          const startDate = new Date(dueDate)
          startDate.setDate(startDate.getDate() - 280)

          // Calculate current week
          const diffInMs = new Date().getTime() - startDate.getTime()
          const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7))
          const currentWeek = Math.max(1, Math.min(42, diffInWeeks))

          await prisma.pregnancy.create({
            data: {
              userId: user.id,
              startDate,
              dueDate,
              currentWeek,
              status: "ACTIVE",
              riskLevel: "LOW"
            }
          })
          console.log(`✅ Auto-created pregnancy for user ${user.id} at week ${currentWeek}`)
        }
      } catch (pregErr) {
        console.error("Failed to auto-create pregnancy:", pregErr)
        // We don't fail the whole registration if pregnancy record creation fails
      }
    }

    // Generate session token for mobile auto-login (consistent with mobile-login)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    })).toString('base64');

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        token: sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
        },
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


