"use client";
import React, { useEffect, useRef } from "react";
import { useAnimate } from "./animationContext";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// ✅ دالة تنسيق scientific notation للارقام الكبيرة
function formatScientific(num) {
  if (isNaN(num)) return "-";

  // لو الرقم أقل من مليون → طبيعي
  if (Math.abs(num) < 10_000) {
    return new Intl.NumberFormat().format(num);
  }

  // رقم كبير → scientific مثل 4.556e12
  return Number(num).toExponential(2);
}


// ✅ AnimatedNumber مع scientific notation + إصلاح الأنيميشن
export function AnimatedNumber({ value }) {
  const { animateTrigger } = useAnimate();

  // ❗ نحسب القيمة أولاً
  const numericValue =
    value === null || value === undefined || value === "" || value === "-"
      ? null
      : Number(value);

  // ❗ Hooks يجب أن تأتي هنا فقط
  const motionValue = useRef(useMotionValue(numericValue ?? 0)).current;

  const formatted = useTransform(motionValue, (latest) =>
    formatScientific(latest)
  );

  // ❗ أنيميشن داخل useEffect
  useEffect(() => {
    if (numericValue === null) {
      motionValue.set(0);
      return;
    }

    if (!animateTrigger) {
      motionValue.set(numericValue);
      return;
    }

    animate(motionValue, numericValue, {
      duration: 1.3,
      ease: "easeOut",
    });
  }, [numericValue, animateTrigger]);

  // ❗ return بعد كل الـ hooks
  if (numericValue === null) return <span>-</span>;

  return <motion.span>{formatted}</motion.span>;
}
