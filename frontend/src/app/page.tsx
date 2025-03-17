"use client";
import Image from "next/image";
import RootLayout from "./layout";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import TaskContainer from "@/components/TaskContainer";
import { useRouter } from "next/navigation";
import { getTodolistByDate, updateTodolist } from "@/apis/todolist";
import { TaskData } from "@/components/TaskContainer";
import { parseTaskData } from "@/utils/formattedJSONBData";

export default function Home() {
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaved, setIsSaved] = useState(true); // ตรวจสอบว่าบันทึกสำเร็จหรือยัง
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [taskQuery, setTaskQuery] = useState<{
    id: number;
    date: string;
    taskData: TaskData[];
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // อัปเดต state เพื่อเปลี่ยน UI
    router.push("/login");
  };

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });

    setCurrentDate(date);
  }, []);

  useEffect(() => {
    // ดึงข้อมูล todolist ตามวันที่
    if (currentDate) {
      getTodolistByDate(currentDate, user.username).then((data) => {
        if (data) {
          const parsedData = parseTaskData(data.taskData[0]);
          console.log(parsedData);
          if (parsedData) {
            setTaskQuery({
              id: data.id,
              date: data.date,
              taskData: parsedData,
            });
          } else {
            console.log("Failed to parse task data.");
          }
        }
      });
    }
  }, [currentDate]);

  const toggleTask = (taskIndex: number) => {
    if (taskQuery) {
      // console.log(taskIndex);
      const updatedTaskData = [...taskQuery.taskData];
      updatedTaskData[taskIndex].done = !updatedTaskData[taskIndex].done;
      setTaskQuery({
        ...taskQuery,
        taskData: updatedTaskData,
      });
      setIsSaved(false); // รีเซ็ตสถานะ ให้ autosave ทำงานอีกครั้ง
    }
  };

  const deleteTask = (taskIndex: number) => {
    if (taskQuery) {
      const updatedTaskData = taskQuery.taskData.filter(
        (_, index) => index !== taskIndex, // ลบ task ที่ตรงกับ index
      );

      setTaskQuery({
        ...taskQuery,
        taskData: updatedTaskData, // อัปเดต state taskData
      });
      setIsSaved(false); // ตั้งสถานะให้ autosave ทำงานใหม่
    }
  };

  useEffect(() => {
    if (!taskQuery || isSaved) return; // ถ้าไม่มี taskQuery หรือบันทึกสำเร็จแล้ว ให้ข้าม

    autosaveIntervalRef.current = setInterval(() => {
      console.log(typeof taskQuery?.taskData);

      let tasks = taskQuery.taskData.map(
        (task) =>
          `{priority: '${task.priority}', text: '${task.text}', desc: '${task.desc}', done: ${task.done}}`,
      );

      const taskData = [tasks.join(",")]; // แปลงเป็น JSONB array

      updateTodolist(taskQuery.id, taskData)
        .then((result) => {
          console.log("✅ Autosave success:", result);
          clearInterval(autosaveIntervalRef.current!); // หยุด autosave เมื่อเซฟสำเร็จ
          setIsSaved(true); // ตั้งค่าให้รู้ว่าบันทึกสำเร็จแล้ว
        })
        .catch((error) => {
          console.error("❌ Autosave failed:", error);
        });
    }, 5000); // บันทึกทุก 5 วินาที

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [taskQuery, isSaved]);

  return (
    <RootLayout>
      {user && (
        <>
          <div className="absolute top-1 right-2 flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white shadow-sm px-3 py-1.5 rounded-md">
              <span className="text-gray-700 text-sm font-medium">
                👤 {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-2 py-0.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="absolute top-1 left-2 flex items-center space-x-4">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ease-in-out ${
                isSaved ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {isSaved ? "Saved" : "Not Saved"}
            </div>
          </div>
          <Card>
            <Header dateString={currentDate} />
            <TaskContainer
              taskData={taskQuery ? taskQuery.taskData : []}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            ></TaskContainer>
          </Card>
        </>
      )}
    </RootLayout>
  );
}
