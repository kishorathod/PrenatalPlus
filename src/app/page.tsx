import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Baby, Stethoscope, Settings, ShieldCheck, Activity, FileText, Calendar, Search, LogOut, Heart, Brain, Lock, Award, Clock, Users } from "lucide-react"
import { auth, signOut } from "@/server/auth"
import SmokeyCursor from "@/components/lightswind/smokey-cursor"


export default async function HomePage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-[#F8F9FB] overflow-x-hidden">
      {/* Header - Show if user is logged in */}
      {session?.user && (
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
              <form action={async () => {
                'use server'
                await signOut({ redirectTo: "/" })
              }}>
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
      <section className="relative overflow-hidden pt-32 pb-48 lg:pt-40 lg:pb-64 bg-gradient-to-br from-healthcare-cream via-white to-healthcare-blue/5">
        {/* Decorative background elements - Emotional & Soft */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Pregnancy Silhouette / Soft Shape */}
          <div className="absolute top-1/4 -right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-healthcare-pink/20 to-healthcare-lavender/20 rounded-full blur-3xl opacity-60 animate-pulse duration-[8s]"></div>

          {/* Warm Glow behind Text */}
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-healthcare-blue/10 rounded-full blur-[100px]"></div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-healthcare-text-primary mb-6 max-w-4xl mx-auto leading-[1.1]">
            Your Pregnancy, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-healthcare-blue to-healthcare-lavender relative">
              Supported Every Step.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-healthcare-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Your all-in-one companion to track pregnancy, monitor health, and stay connected with your care team.
          </p>

          {/* Primary CTA Buttons - Modern & Soft */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
            <Button asChild size="lg" className="group bg-healthcare-blue hover:bg-blue-500 text-white shadow-[0_10px_40px_-10px_rgba(77,159,255,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(77,159,255,0.6)] rounded-full px-10 h-16 text-lg font-semibold transition-all hover:scale-105 hover:-translate-y-1">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-healthcare-blue/20 text-healthcare-text-primary hover:bg-healthcare-cream hover:text-healthcare-blue rounded-full px-10 h-16 text-lg font-semibold transition-all hover:scale-105 hover:-translate-y-1 bg-white/60 backdrop-blur-sm">
              <Link href="#features">
                Explore Platform
              </Link>
            </Button>
          </div>
        </div>

        {/* Soft Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Role Cards Section */}
      <section id="features" className="container mx-auto px-4 -mt-32 relative z-20 pb-32">
        <div className="grid gap-8 md:grid-cols-3 items-stretch">

          {/* Patient / Family Card */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 h-full">
            <div className="relative h-full bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(77,159,255,0.25)] transition-all duration-500 hover:-translate-y-2 overflow-hidden group flex flex-col">
              {/* Card Gradient Top - Stronger */}
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-healthcare-blue/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="mb-8 inline-flex p-5 rounded-2xl bg-gradient-to-br from-healthcare-blue/20 to-healthcare-blue/10 text-healthcare-blue group-hover:scale-110 transition-transform duration-500 shadow-md shadow-blue-100 border border-healthcare-blue/20">
                  <Baby className="h-12 w-12" />
                </div>

                <h2 className="text-2xl font-heading font-bold text-healthcare-text-primary mb-3">Patient / Family</h2>
                <p className="text-healthcare-text-secondary mb-8 leading-relaxed">Comprehensive care for expectant mothers covering every stage of pregnancy.</p>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-blue shadow-[0_0_10px_rgba(77,159,255,0.6)]"></div>
                    Weekly growth tracking
                  </li>
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-blue shadow-[0_0_10px_rgba(77,159,255,0.6)]"></div>
                    Vitals & medical reports
                  </li>
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-blue shadow-[0_0_10px_rgba(77,159,255,0.6)]"></div>
                    Appointment reminders
                  </li>
                </ul>

                <Button asChild className="w-full bg-healthcare-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 rounded-xl h-14 text-base transition-all group-hover:shadow-blue-300/50 group-hover:scale-[1.02]">
                  <Link href="/login/patient">
                    Login as Patient <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <div className="mt-6 text-center">
                  <Link href="/register?role=patient" className="text-sm text-healthcare-text-secondary hover:text-healthcare-blue hover:underline font-medium transition-colors">Create new account</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor / Clinician Card */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 h-full">
            <div className="relative h-full bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(75,199,168,0.25)] transition-all duration-500 hover:-translate-y-2 overflow-hidden group flex flex-col">
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-healthcare-mint/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="mb-8 inline-flex p-5 rounded-2xl bg-gradient-to-br from-healthcare-mint/20 to-healthcare-mint/10 text-healthcare-mint group-hover:scale-110 transition-transform duration-500 shadow-md shadow-mint-100 border border-healthcare-mint/20">
                  <Stethoscope className="h-12 w-12" />
                </div>

                <h2 className="text-2xl font-heading font-bold text-healthcare-text-primary mb-3">Doctor</h2>
                <p className="text-healthcare-text-secondary mb-8 leading-relaxed">Advanced tools for clinicians to monitor and manage patient health effectively.</p>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-mint shadow-[0_0_10px_rgba(75,199,168,0.6)]"></div>
                    Real-time patient monitoring
                  </li>
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-mint shadow-[0_0_10px_rgba(75,199,168,0.6)]"></div>
                    Digital prescription & notes
                  </li>
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-mint shadow-[0_0_10px_rgba(75,199,168,0.6)]"></div>
                    High-risk alerts system
                  </li>
                </ul>

                <Button asChild variant="outline" className="w-full border-healthcare-mint text-healthcare-mint hover:bg-healthcare-mint hover:text-white rounded-xl h-14 text-base transition-all group-hover:scale-[1.02]">
                  <Link href="/login/doctor">Doctor Login</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 h-full">
            <div className="relative h-full bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(167,139,250,0.25)] transition-all duration-500 hover:-translate-y-2 overflow-hidden group flex flex-col">
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-healthcare-lavender/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="mb-8 inline-flex p-5 rounded-2xl bg-gradient-to-br from-healthcare-lavender/20 to-healthcare-lavender/10 text-healthcare-lavender group-hover:scale-110 transition-transform duration-500 shadow-md shadow-lavender-100 border border-healthcare-lavender/20">
                  <ShieldCheck className="h-12 w-12" />
                </div>

                <h2 className="text-2xl font-heading font-bold text-healthcare-text-primary mb-3">Admin</h2>
                <p className="text-healthcare-text-secondary mb-8 leading-relaxed">System management oversight for clinics and hospital administrators.</p>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-lavender shadow-[0_0_10px_rgba(167,139,250,0.6)]"></div>
                    Staff & User Management
                  </li>
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-lavender shadow-[0_0_10px_rgba(167,139,250,0.6)]"></div>
                    System Configuration
                  </li>
                  <li className="flex items-center gap-3 text-healthcare-text-secondary group-hover:text-healthcare-text-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-healthcare-lavender shadow-[0_0_10px_rgba(167,139,250,0.6)]"></div>
                    Audit Logs access
                  </li>
                </ul>

                <Button asChild variant="outline" className="w-full border-healthcare-lavender text-healthcare-lavender hover:bg-healthcare-lavender hover:text-white rounded-xl h-14 text-base transition-all group-hover:scale-[1.02]">
                  <Link href="/login/admin">Admin Access</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Wave Separator */}
      <div className="w-full overflow-hidden leading-none">
        <svg className="relative block w-[calc(100%+1.3px)] h-[100px] text-white" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white to-healthcare-cream/50">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-healthcare-blue/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-healthcare-text-primary mb-6">Why Families Trust PrenatalPlus</h2>
            <p className="text-xl text-healthcare-text-secondary max-w-3xl mx-auto font-light leading-relaxed">We combine medical expertise with comforting care to ensure the improved well-being of mother and child.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { icon: Heart, title: "Personalized Care", desc: "Tailored health tracking adapted to your unique pregnancy journey.", color: "text-healthcare-pink", bg: "bg-healthcare-pink/10" },
              { icon: Brain, title: "AI-Powered Insights", desc: "Smart analysis of your vitals to detect potential risks early.", color: "text-healthcare-blue", bg: "bg-healthcare-blue/10" },
              { icon: Lock, title: "Secure Medical Data", desc: "Your health records are encrypted and shared only with your doctors.", color: "text-healthcare-mint", bg: "bg-healthcare-mint/10" },
              { icon: Award, title: "Trusted by Doctors", desc: "Designed with obstetricians to meet clinical standards.", color: "text-healthcare-lavender", bg: "bg-healthcare-lavender/10" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards" style={{ animationDelay: `${i * 150}ms` }}>
                <div className={`p-6 rounded-[2rem] ${item.bg} ${item.color} mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <item.icon className="h-10 w-10" />
                </div>
                <h3 className="font-heading font-bold text-xl text-healthcare-text-primary mb-3">{item.title}</h3>
                <p className="text-base text-healthcare-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section id="all-features" className="py-32 bg-healthcare-cream relative">
        {/* Background blobs */}
        <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-healthcare-blue/5 blur-3xl pointer-events-none animate-pulse duration-[5s]"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-healthcare-pink/5 blur-3xl pointer-events-none animate-pulse duration-[7s]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-healthcare-text-primary mb-6">Everything You Need</h2>
              <p className="text-xl text-healthcare-text-secondary max-w-xl font-light">A complete suite of tools designed to make pregnancy management easier and safer.</p>
            </div>
            <Button variant="outline" className="rounded-full gap-2 px-8 h-12 border-healthcare-blue text-healthcare-blue hover:bg-healthcare-blue hover:text-white transition-all hover:scale-105">
              <a href="#all-features" className="flex items-center gap-2">
                View All Features <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Vitals Tracking", desc: "Monitor BP, weight, and more with ease.", icon: Activity, color: "text-blue-500" },
              { title: "Appointments", desc: "Never miss a check-up with smart reminders.", icon: Calendar, color: "text-purple-500" },
              { title: "Community", desc: "Connect with other mothers for support.", icon: Users, color: "text-pink-500" },
              { title: "Resources", desc: "Expert articles and pregnancy guides.", icon: FileText, color: "text-teal-500" },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-white group-hover:shadow-md transition-all duration-300 ${feature.color}`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-healthcare-blue group-hover:-rotate-45 transition-all duration-300 transform" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer Minimal & Soft */}
      <footer className="py-16 bg-white border-t border-gray-100 relative">
        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-healthcare-blue to-healthcare-lavender rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200/50">P+</div>
              <span className="font-heading font-bold text-2xl text-healthcare-text-primary">PrenatalPlus</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-healthcare-text-secondary text-sm mb-2">© {new Date().getFullYear()} PrenatalPlus. All rights reserved.</p>
              <p className="text-healthcare-lavender text-sm font-medium">Made with ❤️ for mothers everywhere.</p>
            </div>

            <div className="flex items-center gap-8">
              <Link href="#" className="text-sm font-medium text-healthcare-text-secondary hover:text-healthcare-blue transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm font-medium text-healthcare-text-secondary hover:text-healthcare-blue transition-colors">
                Contact Support
              </Link>
              <div className="flex gap-4 pl-4 border-l border-gray-100">
                {/* Social placeholders - Soft & Interactive */}
                <div className="h-10 w-10 rounded-full bg-healthcare-gray/50 hover:bg-healthcare-blue hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 shadow-sm hover:shadow-blue-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </div>
                <div className="h-10 w-10 rounded-full bg-healthcare-gray/50 hover:bg-healthcare-pink hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 shadow-sm hover:shadow-pink-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
              </div>
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
