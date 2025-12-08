import jsPDF from "jspdf"

interface PregnancyData {
    patientName: string
    currentWeek: number
    dueDate: Date
    riskLevel?: string
}

interface VitalsData {
    date: Date
    systolic?: number
    diastolic?: number
    heartRate?: number
    weight?: number
}

export function generatePregnancySummary(data: {
    patient: PregnancyData
    vitals: VitalsData[]
    appointments: any[]
}) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(20)
    doc.setTextColor(219, 39, 119) // Pink
    doc.text("Pregnancy Summary Report", pageWidth / 2, 20, { align: "center" })

    // Patient Info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Patient: ${data.patient.patientName}`, 20, 40)
    doc.text(`Current Week: ${data.patient.currentWeek}`, 20, 50)
    doc.text(`Due Date: ${new Date(data.patient.dueDate).toLocaleDateString()}`, 20, 60)
    if (data.patient.riskLevel) {
        doc.text(`Risk Level: ${data.patient.riskLevel}`, 20, 70)
    }

    // Vitals Summary
    doc.setFontSize(14)
    doc.setTextColor(219, 39, 119)
    doc.text("Recent Vitals", 20, 90)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    let yPos = 100
    data.vitals.slice(0, 5).forEach((vital) => {
        const date = new Date(vital.date).toLocaleDateString()
        const bp = vital.systolic && vital.diastolic ? `${vital.systolic}/${vital.diastolic}` : "N/A"
        const hr = vital.heartRate || "N/A"
        const weight = vital.weight || "N/A"

        doc.text(`${date} - BP: ${bp} mmHg, HR: ${hr} bpm, Weight: ${weight} kg`, 25, yPos)
        yPos += 8
    })

    // Appointments
    doc.setFontSize(14)
    doc.setTextColor(219, 39, 119)
    doc.text("Upcoming Appointments", 20, yPos + 10)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    yPos += 20
    data.appointments.slice(0, 5).forEach((apt) => {
        const date = new Date(apt.date).toLocaleDateString()
        doc.text(`${date} - ${apt.title || "Checkup"}`, 25, yPos)
        yPos += 8
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
        `Generated on ${new Date().toLocaleDateString()} - PrenatalPlus`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
    )

    return doc
}

export function generateVitalsReport(data: {
    patientName: string
    vitals: VitalsData[]
}) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(20)
    doc.setTextColor(219, 39, 119)
    doc.text("Vitals History Report", pageWidth / 2, 20, { align: "center" })

    // Patient Info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Patient: ${data.patientName}`, 20, 40)
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 50)

    // Table Header
    doc.setFontSize(10)
    doc.setFillColor(219, 39, 119)
    doc.rect(20, 65, pageWidth - 40, 8, "F")
    doc.setTextColor(255, 255, 255)
    doc.text("Date", 25, 70)
    doc.text("Blood Pressure", 70, 70)
    doc.text("Heart Rate", 120, 70)
    doc.text("Weight", 160, 70)

    // Table Rows
    doc.setTextColor(0, 0, 0)
    let yPos = 80
    data.vitals.forEach((vital, index) => {
        if (yPos > 270) { // New page if needed
            doc.addPage()
            yPos = 20
        }

        const date = new Date(vital.date).toLocaleDateString()
        const bp = vital.systolic && vital.diastolic ? `${vital.systolic}/${vital.diastolic}` : "N/A"
        const hr = vital.heartRate ? `${vital.heartRate} bpm` : "N/A"
        const weight = vital.weight ? `${vital.weight} kg` : "N/A"

        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245)
            doc.rect(20, yPos - 5, pageWidth - 40, 8, "F")
        }

        doc.text(date, 25, yPos)
        doc.text(bp, 70, yPos)
        doc.text(hr, 120, yPos)
        doc.text(weight, 160, yPos)

        yPos += 10
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
        `Generated on ${new Date().toLocaleDateString()} - PrenatalPlus`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
    )

    return doc
}

export function downloadPDF(doc: jsPDF, filename: string) {
    doc.save(filename)
}
