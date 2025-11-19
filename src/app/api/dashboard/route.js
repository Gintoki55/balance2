import { connectDB } from "@/lib/mongo";
import mongoose from "mongoose";

// ✅ 1. تعريف الـ Schema الخاص بالـ Dashboard
const DashboardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // اسم الـ Dashboard
  stationData: { type: Array, default: [] }, // نحفظ نسخة كاملة من الجدول
  JValues: { type: Array, default: [] }, // <-- هنا نضيف الـ JValues الجديدة
});

// ✅ 2. تعريف الموديل (Model)
const DashboardModel =
  mongoose.models.Dashboard || mongoose.model("Dashboard", DashboardSchema);

// ✅ 3. حفظ Dashboard جديد أو تحديث الموجود
export async function POST(req) {
  try {
    const { name, stationData, JValues } = await req.json();
    await connectDB();

    if (!name) {
      return new Response(
        JSON.stringify({ success: false, message: "Dashboard name is required" }),
        { status: 400 }
      );
    }

    const updated = await DashboardModel.findOneAndUpdate(
      { name },
      { stationData, JValues }, // نحفظ الاثنين
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "✅ Dashboard saved successfully",
        data: updated,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error saving dashboard:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Error saving dashboard" }),
      { status: 500 }
    );
  }
}

// ✅ 4. جلب جميع الـ Dashboards
export async function GET() {
  try {
    await connectDB();
    const dashboards = await DashboardModel.find().lean();
    return new Response(JSON.stringify({ success: true, dashboards }), { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching dashboards:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching dashboards" }),
      { status: 500 }
    );
  }
}
