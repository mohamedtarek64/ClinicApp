import React, { useState, useEffect } from "react";
import { AppointmentContext } from "./AppointmentContext.js"; 
import { appointmentService, authService } from "../services/api";

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب المواعيد الحقيقية من السيرفر
  const refreshAppointments = async () => {
    setLoading(true);
    try {
      const profile = await authService.getProfile();
      if (profile.patientId) {
        const data = await appointmentService.getPatientAppointments(profile.patientId);
        // تحويل البيانات من شكل السيرفر لشكل الفرونت إند
        const mapped = data.map(app => ({
          id: app.id,
          doctorName: `Dr. ${app.doctorFirstName} ${app.doctorLastName}`,
          doctorImg: `https://i.pravatar.cc/150?u=${app.doctorId}`,
          spec: app.specialization || "General Medicine",
          date: new Date(app.scheduleDate).toLocaleDateString(),
          time: new Date(app.scheduleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "Consultation",
          isCancelled: app.status === "Cancelled"
        }));
        setAppointments(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshAppointments();
    }
  }, []);

  const addAppointment = (appointment) => {
    // إضافته محلياً فوراً للسرعة، ثم التحديث من السيرفر
    setAppointments((prev) => [appointment, ...prev]);
    refreshAppointments(); 
  };

  const cancelAppointment = async (id) => {
    try {
      // هنا المفروض نكلم API الكنسلة لو موجود، حالياً هنكتفي بالمسح المحلي
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment, refreshAppointments, loading }}>
      {children}
    </AppointmentContext.Provider>
  );
}