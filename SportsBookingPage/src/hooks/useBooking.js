// useBooking.js - Custom hook สำหรับจัดการการจอง
import { useState } from 'react';
import { bookingsAPI } from '../services/api';

export const useBooking = (sportType) => {
  const [loading, setLoading] = useState(false);
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(
    sessionStorage.getItem(`has${sportType}Booked`) === 'true'
  );

  const bookCourt = async (courtId, selectedTime) => {
    setLoading(true);
    try {
      // Map time format HH.00-HH.00 to ISO format
      const [startHour] = selectedTime.split('-')[0].split('.');
      const [endHour] = selectedTime.split('-')[1].split('.');

      const today = new Date().toISOString().split('T')[0];
      const startTime = `${today}T${startHour}:00:00Z`;
      const endTime = `${today}T${endHour}:00:00Z`;

      await bookingsAPI.createBooking(courtId, startTime, endTime);

      // Mark as booked in this session
      sessionStorage.setItem(`has${sportType}Booked`, 'true');
      setIsMaxLimitReached(true);

      return { success: true, message: 'จองสนามสำเร็จ!' };
    } catch (error) {
      return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isMaxLimitReached,
    bookCourt,
  };
};
