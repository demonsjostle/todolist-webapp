"use client";

export function parseTaskData(rawData) {
  const correctedString = rawData
    // เพิ่มเครื่องหมาย " รอบ key
    .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
    // เพิ่มเครื่องหมาย " รอบค่าของ key
    .replace(/'([^']+)'/g, '"$1"');

  // เพิ่มเครื่องหมาย [] รอบข้อมูลทั้งหมดเพื่อให้เป็น array ที่ JSON รองรับ
  const jsonString = `[${correctedString}]`;

  try {
    // ใช้ JSON.parse เพื่อแปลงเป็น object
    const taskObject = JSON.parse(jsonString);
    return taskObject;
  } catch (error) {
    console.error("Invalid JSON format", error);
    return null;
  }
}
