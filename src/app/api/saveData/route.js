import { connectDB } from "@/lib/mongo";
import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  file: { type: String, unique: true },
  data: {
    scenario: String,
    j: Number,
  },
});

const FileModel = mongoose.models.File || mongoose.model("File", FileSchema);

export async function POST(req) {
  try {
    const { file, scenario, j } = await req.json();
    await connectDB();

    const updated = await FileModel.findOneAndUpdate(
      { file },
      { data: { scenario, j } },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({ success: true, message: "✅ Saved", data: updated }),
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
    const files = await FileModel.find();
    return new Response(JSON.stringify({ success: true, files }), { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    return new Response(JSON.stringify({ success: false, message: "Error fetching data" }), {
      status: 500,
    });
  }
}
