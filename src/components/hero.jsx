export default function Hero() {
    return (
      <section className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 to-slate-700/90"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-full lg:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Simulate the Future<br />
              of Desalination
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
              Explore, design, and analyze advanced desalination systems — from Multi-Stage 
              Flash to Reverse Osmosis — using our immersive platform built for innovation and 
              education.
            </p>
          </div>
        </div>
  
        {/* Industrial Equipment Image Overlay */}
        <div className="absolute right-0 top-0 h-full w-1/3 lg:w-1/2 bg-gradient-to-l from-transparent to-slate-800 hidden sm:block">
          <div className="h-full w-full bg-[url('https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg')] bg-cover bg-center opacity-40"></div>
        </div>
      </section>
    );
  }