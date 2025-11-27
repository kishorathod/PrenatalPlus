import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Baby, Stethoscope, Settings, ShieldCheck, Activity, FileText, Calendar, Search, LogOut } from "lucide-react"
import { auth } from "@/server/auth"

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-[#F8F9FB] overflow-x-hidden">
      {/* Header - Show if user is logged in */}
      {session && (
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{session.user.name}</span>
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href={
                  session.user.role === "DOCTOR" ? "/doctor/dashboard" :
                    session.user.role === "ADMIN" ? "/admin/dashboard" :
                      "/patient/dashboard"
                }>
                  Go to Dashboard
                </Link>
              </Button>
              <form action="/api/auth/signout" method="POST">
                <Button type="submit" variant="ghost" size="sm" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl animate-pulse duration-[4000ms]"></div>
          <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-100/40 blur-3xl animate-pulse duration-[5000ms]"></div>

          {/* Heartbeat line illustration (subtle) */}
          <svg className="absolute top-1/3 left-0 w-full h-32 opacity-[0.03] pointer-events-none" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 L400,60 L420,20 L440,90 L460,60 L1200,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-900" />
          </svg>

          {/* Subtle Grid/Dot Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" className="text-blue-900" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
            Your Complete Maternal & <br className="hidden md:block" />
            <span className="text-[#3A8DFF] font-extrabold">Child Health Companion</span>
          </h1>

          {/* Trust Badge - Moved below headline */}
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-600 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Trusted by Families
          </div>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            A comprehensive care platform connecting expectant mothers, doctors, and clinics for a safer, healthier pregnancy journey.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-[#3A8DFF] hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 rounded-full px-8 h-14 text-lg transition-all hover:scale-105">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full px-8 h-14 text-lg transition-all hover:scale-105">
              <Link href="#features">
                Explore Platform <Search className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section id="features" className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="grid gap-y-10 gap-x-12 md:grid-cols-3 items-start">

          {/* Patient / Family Card - Primary & Largest */}
          <div className="md:col-span-1 md:row-span-2 transform md:-translate-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="bg-gradient-to-b from-[#eef6ff] to-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(58,141,255,0.15)] border border-blue-100 overflow-hidden hover:shadow-[0_30px_60px_-12px_rgba(58,141,255,0.2)] transition-all duration-300 hover:-translate-y-1 h-full flex flex-col group">
              <div className="bg-[#3A8DFF] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Baby className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Patient / Family</h2>
                </div>
                <p className="text-blue-100 relative z-10">For expectant mothers & families</p>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <ul className="space-y-5 mb-8 flex-1">
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-1 p-1.5 rounded-full bg-blue-100 text-[#3A8DFF] group-hover/item:bg-[#3A8DFF] group-hover/item:text-white transition-colors">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 block">Track Pregnancy</span>
                      <span className="text-sm text-gray-500">Weekly updates & baby growth</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-1 p-1.5 rounded-full bg-blue-100 text-[#3A8DFF] group-hover/item:bg-[#3A8DFF] group-hover/item:text-white transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 block">View Vitals & Reports</span>
                      <span className="text-sm text-gray-500">Access medical history anytime</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-1 p-1.5 rounded-full bg-blue-100 text-[#3A8DFF] group-hover/item:bg-[#3A8DFF] group-hover/item:text-white transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 block">Appointments</span>
                      <span className="text-sm text-gray-500">Easy scheduling & reminders</span>
                    </div>
                  </li>
                </ul>

                <Button asChild size="lg" className="w-full bg-[#3A8DFF] hover:bg-blue-600 text-white shadow-lg shadow-blue-200 rounded-xl h-14 text-lg transition-transform hover:scale-[1.02]">
                  <Link href="/login/patient">
                    Login as Patient <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <p className="text-center mt-4 text-sm text-gray-400">
                  New here? <Link href="/register?role=patient" className="text-[#3A8DFF] hover:underline font-medium">Create account</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Doctor / Clinician Card */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="bg-gradient-to-b from-[#f0fdfa] to-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(79,186,167,0.1)] border border-teal-100 overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(79,186,167,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group">
              <div className="bg-[#4FBAA7] p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Doctor</h2>
                    <p className="text-teal-50 text-xs">Clinicians & Specialists</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-4 mb-6 flex-1">
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="h-2 w-2 rounded-full bg-[#4FBAA7]"></span>
                    Patient management
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="h-2 w-2 rounded-full bg-[#4FBAA7]"></span>
                    View vitals & history
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="h-2 w-2 rounded-full bg-[#4FBAA7]"></span>
                    Add notes & reports
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="h-2 w-2 rounded-full bg-[#4FBAA7]"></span>
                    Clinic workflow
                  </li>
                </ul>

                <Button asChild variant="outline" className="w-full border-[#4FBAA7] text-[#4FBAA7] hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-transform hover:scale-[1.02]">
                  <Link href="/login/doctor">Doctor Login</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group">
              <div className="bg-gray-800 p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-5 w-5 text-gray-200" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Admin</h2>
                    <p className="text-gray-400 text-xs">System & Management</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-4 mb-6 flex-1">
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    User management
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <Building2Icon className="h-4 w-4 text-gray-400" />
                    Clinics & departments
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <Settings className="h-4 w-4 text-gray-400" />
                    System configuration
                  </li>
                </ul>

                <Button asChild variant="ghost" className="w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-transform hover:scale-[1.02]">
                  <Link href="/login/admin">Admin Access</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} MotherCare+. All rights reserved.</p>

            <div className="flex items-center gap-8">
              <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Terms & Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
