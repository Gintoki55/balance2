"use client";
import StationHeader from "@/components/stationheader";
import Link from "next/link";

export default function MediaPage() {
  const faqItems = [
    {
      question: "ما هو هذا النظام؟",
      answer: "هذا النظام هو محاكاة تعليمية تهدف لتوضيح كيفية عمل محاكاة التناضح العكسي."
    },
    {
      question: "كيف يمكن استخدام الفيديوهات؟",
      answer: "يمكنك مشاهدة الفيديو الرئيسي لفهم الأساسيات، ثم متابعة الفيديوهات الفرعية لمزيد من التفاصيل."
    },
    {
      question: "هل هذه المحاكاة تفاعلية؟",
      answer: "نعم، بعض الفيديوهات توضح كيفية التفاعل مع المحاكاة خطوة بخطوة."
    },
  ];

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* الهيدر */}
      <StationHeader title="Media & Tutorials" />

      <div className="p-4 sm:p-6 space-y-12 max-w-6xl mx-auto">

        {/* العنوان والفيديو التعريفي */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">تعرف على نظام المحاكاة</h1>
          <p className="text-gray-600 text-lg">
            شاهد الفيديو التعريفي لفهم كيفية عمل المحاكاة واستخدامها بالشكل الأمثل.
          </p>
          <div className="aspect-w-16 aspect-h-9 mt-4 rounded-xl shadow-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Intro Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* نصوص تعريفية وأنواعه */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">ما هو النظام وأنواعه؟</h2>
          <p className="text-gray-600">
            هذا النظام يوفر محاكاة تعليمية لأنواع مختلفة من العمليات مثل التناضح العكسي، التقطير متعدد التأثيرات، وغيرها. الهدف هو تعليم المستخدمين كيفية التعامل مع هذه الأنظمة بشكل آمن وفعال.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>محاكاة التناضح العكسي (RO Simulation)</li>
            <li>محاكاة التقطير متعدد التأثيرات (MED Simulation)</li>
            <li>محاكاة العمليات المتقدمة في المياه والصرف</li>
          </ul>
        </div>

        {/* الأسئلة الشائعة */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800">{item.question}</h3>
                <p className="text-gray-600 mt-1">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* زر التواصل */}
        <div className="text-center mt-8">
          <Link href="/contact">
            <button className="bg-[#429988] text-white px-6 py-3 rounded-lg shadow-lg text-lg 
                               hover:bg-[#367c6e] transition active:scale-95">
              تواصل معنا
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
