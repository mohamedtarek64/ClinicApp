// import { createContext, useContext } from "react";

// // ده مجرد تعريف للمخزن
// export const AppointmentContext = createContext();

// // ده الـ Hook اللي بنستخدمه في الصفحات
// export function useAppointments() {
//   return useContext(AppointmentContext);
// }
// import { createContext } from "react";
// export const AppointmentContext = createContext();
import { createContext, useContext } from "react";

// 1. التعريف
export const AppointmentContext = createContext();

// 2. الـ Hook (نقلناه هنا عشان الـ ESLint يسكت في الملف التاني)
export const useAppointments = () => {
  return useContext(AppointmentContext);
};
