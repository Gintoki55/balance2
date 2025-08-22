"use client";
import StationHeader from "@/components/stationheader";

export default function MediaPage() {
  // مثال لمقاطع الفيديو
  const mainVideo = {
    title: "Main Tutorial Video",
    description: "شرح شامل حول استخدام المحاكاة.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  };

  const subVideos = [
    {
      id: 1,
      title: "Video 1",
      videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    },
    {
      id: 2,
      title: "Video 2",
      videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
    {
      id: 3,
      title: "Video 3",
      videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
    },
  ];

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* الهيدر الجديد */}
      <StationHeader title="Media" />

      <div className="p-4 sm:p-6 space-y-12">

        {/* الفيديو الكبير في الوسط */}
        <div className="max-w-4xl mx-auto">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={mainVideo.videoUrl}
              title={mainVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl shadow-lg"
            ></iframe>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{mainVideo.title}</h2>
          <p className="text-gray-600 mt-1">{mainVideo.description}</p>
        </div>

        {/* الفيديوهات الثلاثة تحت */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subVideos.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src={item.videoUrl}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
