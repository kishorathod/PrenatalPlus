import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-muted-foreground">
              © {currentYear} MotherCare+. All rights reserved.
            </p>

          </div>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for expecting mothers
          </p>
        </div>
      </div>
    </footer>
  )
}


