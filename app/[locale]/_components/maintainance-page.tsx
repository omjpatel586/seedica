import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-stone-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-green-600"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo Section */}
          <div className="mb-12 flex justify-center">
            {/* Replace with your actual logo */}

            <div className="relative w-48 h-20">
              <Image
                src="/assets/logo.webp" // Make sure your logo is in public/logo.png
                alt="Seedica Logo"
                fill // This makes it responsive to the parent div
                className="object-contain" // Keeps the logo from stretching
                priority // Tells Next.js to load this first
              />
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">
                Agricultural Solutions
              </p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-stone-800 text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Cultivating a New <span className="text-green-600">Digital Experience</span>
          </h2>

          <p className="text-stone-600 text-lg md:text-xl mb-8 leading-relaxed">
            We are working hard to bring you the finest range of
            <span className="font-semibold text-stone-800"> Fertilizer, Pesticides </span>
            and high-quality seeds. Something organic is growing here!
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 h-2 rounded-full mb-4 overflow-hidden">
            <div className="bg-green-600 h-full w-[5%] rounded-full transition-all duration-1000"></div>
          </div>
          <p className="text-sm text-stone-500 font-medium mb-10">Preparation Progress: 5%</p>

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-stone-200">
            <p className="text-stone-500 text-sm italic">
              Bringing the richness of the soil to your doorstep.
            </p>
            {/* <div className="mt-4 flex justify-center gap-6 text-stone-400">
              <a href="#" className="hover:text-green-600 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                WhatsApp
              </a>
              <a href="#" className="hover:text-green-600 transition-colors">
                Instagram
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
