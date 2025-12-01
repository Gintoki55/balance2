import { connectDB } from "@/lib/mongo";
import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  file: { type: String, unique: true },
  data: {
    stationData: { type: Array, default: [] }, // ✅ نحفظ الجدول بالكامل هنا
  },
});

const FileModel = mongoose.models.msfFile || mongoose.model("msfFile", FileSchema);

export async function POST(req) {
  try {
    const { file, stationData } = await req.json();
    await connectDB();

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, message: "File name is required" }),
        { status: 400 }
      );
    }

    const updated = await FileModel.findOneAndUpdate(
      { file },
      { data: { stationData } },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({ success: true, message: "✅ Project saved", data: updated }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error saving data:", err);
    return new Response(JSON.stringify({ success: false, message: "Error saving data" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    const files = await FileModel.find().lean();
    return new Response(JSON.stringify({ success: true, files }), { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    return new Response(JSON.stringify({ success: false, message: "Error fetching data" }), {
      status: 500,
    });
  }
}
