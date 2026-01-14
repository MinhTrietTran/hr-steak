// src/mockData.js
export const mockData = {
  user: {
    id: 1,
    fullName: "Ngọc Phát",
    checkInTime: "8:23 am",
  },
  leaveBalance: {
    remainingDays: 10,
    totalDays: 12
  },
  attendanceLog: [
    { id: 1, time: "08:32 AM", text: "Checked in successfully", isSpecial: false },
    { id: 2, time: "09:10 AM", text: "Leave request (Nov 15-17) submitted", isSpecial: false },
    { id: 3, time: "10:00 AM", text: "Logged 5 km — November Challenge", isSpecial: true }
  ],
  campaign: {
    current: 65,
    target: 100,
    points: 1250
  }
};