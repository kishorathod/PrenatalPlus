import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // Auth check
        const authHeader = req.headers.get("authorization");
        const session = await auth();
        let userId = session?.user?.id;

        if (!userId && authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
                const decoded = Buffer.from(token, 'base64').toString('utf-8');
                const userData = JSON.parse(decoded);
                userId = userData.userId || userData.id;
            } catch (e) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { doctorId } = body;

        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        // Verify doctor exists and is actually a doctor
        const doctor = await prisma.user.findUnique({
            where: { id: doctorId, role: "DOCTOR" },
        });

        if (!doctor) {
            return NextResponse.json({ error: "Selected doctor not found" }, { status: 404 });
        }

        // Check if there is already an active assignment
        const existingAssignment = await prisma.patientAssignment.findFirst({
            where: {
                patientId: userId,
                status: "ACTIVE",
            },
        });

        if (existingAssignment) {
            // Update existing assignment or mark it inactive and create new?
            // For simplicity and matching web logic, we'll mark old as inactive if it's different
            if (existingAssignment.doctorId !== doctorId) {
                await prisma.patientAssignment.update({
                    where: { id: existingAssignment.id },
                    data: { status: "INACTIVE" },
                });
            } else {
                return NextResponse.json({ message: "Doctor already assigned", assignment: existingAssignment });
            }
        }

        // Create new assignment
        const assignment = await prisma.patientAssignment.create({
            data: {
                patientId: userId,
                doctorId: doctorId,
                status: "ACTIVE",
                assignedAt: new Date(),
            },
        });

        return NextResponse.json({
            message: "Doctor assigned successfully",
            assignment,
            doctor: {
                name: doctor.name,
                specialization: doctor.specialization,
            }
        });

    } catch (error: any) {
        console.error("[Mobile-Doctor-Assign] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
