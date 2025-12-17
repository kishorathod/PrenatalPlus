import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Baby, Stethoscope, ShieldCheck, Heart, Brain, Lock, Award, LogOut } from "lucide-react"
import { auth, signOut } from "@/server/auth"

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#f5f9ff,_#ffffff_60%)]">
      {/* Header */}
      {session?.user && (
        <div className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Logged in as <span className="font-semibold text-slate-900">{session.user.name}</span>
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Link href={
                  session.user.role === "DOCTOR" ? "/doctor/dashboard" :
                    session.user.role === "ADMIN" ? "/admin/dashboard" :
                      "/patient/dashboard"
                }>
                  Dashboard
                </Link>
              </Button>
              <form action={async () => {
                'use server'
                await signOut({ redirectTo: "/" })
              }}>
                <Button type="submit" variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-52">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.15]">
                Your Pregnancy, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Supported Every Step.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Track pregnancy, monitor health, and stay connected with your doctor — all in one secure platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 transform transition-all hover:scale-[1.02] text-base font-semibold">
                  <Link href="/register">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="h-14 px-8 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-base font-medium">
                  <Link href="#features">
                    Explore Platform
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              {/* Blob background for image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 transform scale-90"></div>

              <div className="relative z-10">
                <Image
                  src="/image3.png"
                  alt="Pregnancy Care Illustration"
                  width={600}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section id="features" className="container mx-auto px-4 -mt-24 relative z-20 pb-32">
        <div className="grid gap-8 md:grid-cols-3 items-stretch">

          {/* Patient Card */}
          <div className="group h-full">
            <div className="relative h-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 border border-slate-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
              <div className="p-8 flex flex-col h-full">
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Baby className="h-10 w-10" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3">Patient / Family</h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm">Comprehensive care for expectant mothers covering every stage of pregnancy.</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {['Weekly growth tracking', 'Vitals & medical reports', 'Appointment reminders'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-xl h-12 transition-colors duration-300">
                  <Link href="/login/patient">
                    Login as Patient <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Doctor Card */}
          <div className="group h-full">
            <div className="relative h-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-200/40 border border-slate-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
              <div className="p-8 flex flex-col h-full">
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 text-green-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-10 w-10" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3">Doctor</h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm">Advanced tools for clinicians to monitor and manage patient health effectively.</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {['Real-time patient monitoring', 'Digital prescription & notes', 'High-risk alerts system'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="w-full border-slate-200 text-slate-700 hover:border-green-500 hover:text-green-600 rounded-xl h-12 transition-all">
                  <Link href="/login/doctor">Doctor Login</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div className="group h-full">
            <div className="relative h-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/40 border border-slate-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
              <div className="p-8 flex flex-col h-full">
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 text-purple-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="h-10 w-10" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3">Admin</h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm">System management oversight for clinics and hospital administrators.</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {['Staff & User Management', 'System Configuration', 'Audit Logs access'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="w-full border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 rounded-xl h-12 transition-all">
                  <Link href="/login/admin">Admin Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Why Families Trust PrenatalPlus</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">Medical expertise combined with comforting care for improved well-being.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Personalized Care", desc: "Tailored health tracking adapted to your unique pregnancy journey.", text: "text-pink-600", bg: "bg-pink-50" },
              { icon: Brain, title: "AI-Powered Alerts", desc: "Smart analysis of your vitals to detect potential risks early.", text: "text-blue-600", bg: "bg-blue-50" },
              { icon: Lock, title: "Secure Data", desc: "Your health records are encrypted and shared only with your doctors.", text: "text-green-600", bg: "bg-green-50" },
              { icon: Award, title: "Clinical Standard", desc: "Designed with obstetricians to meet strict medical standards.", text: "text-purple-600", bg: "bg-purple-50" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className={`p-4 rounded-xl ${item.bg} ${item.text} mb-4`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">P+</div>
              <span className="font-heading font-bold text-xl text-slate-900">PrenatalPlus</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-500 text-sm mb-1">© {new Date().getFullYear()} PrenatalPlus.</p>
              <p className="text-slate-400 text-xs">Made with ❤️ for mothers everywhere.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
