import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
export interface TaskData {
  priority: string; // 0 normal 1 hight
  text: string;
  desc: string;
  done: boolean;
}

interface TaskContainerProps {
  taskData?: TaskData[];
  toggleTask: (taskIndex: number) => void; // เปลี่ยนเป็น taskId toggleTask: (taskIndex: number) => void;
  deleteTask: (taskIndex: number) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  taskData,
  toggleTask,
  deleteTask,
}) => {
  const [temporaryTaskData, setTemporaryTaskData] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  useEffect(() => {
    if (taskData) {
      // Create a new array with task objects including 'id'
      const t = taskData.map((task, index) => ({
        ...task,
        id: index, // Add 'id' to each task
      }));
      setTemporaryTaskData(t); // Update state with new array
    }
  }, [taskData]);

  useEffect(() => {
    const todo = temporaryTaskData?.filter((task) => !task.done); // กรอง task ที่ยังไม่เสร็จ
    const done = temporaryTaskData?.filter((task) => task.done); // กรอง task ที่เสร็จแล้ว
    setTodoTasks(todo);
    setDoneTasks(done);
  }, [temporaryTaskData]);

  return (
    <>
      {taskData ? (
        <>
          {/* TODO TASKS */}
          <div className="border-t-2 border-gray-300 border-dashed pt-3 pb-3 pl-1 pr-1">
            <h1 className="text-center text-black font-bold mb-2">
              TODO TASKS
            </h1>
            {todoTasks?.map((task, index) => (
              <TaskCard
                key={index}
                task={task}
                toggleTask={() => toggleTask(task.id)} // ส่ง task.id ไป
                deleteTask={() => deleteTask(task.id)}
              />
            ))}
          </div>

          {/* DONE TASKS */}
          <div className="border-t-2 border-gray-300 border-dashed pt-3 pb-3 pl-1 pr-1 mt-5">
            <h1 className="text-center text-black font-bold mb-2">
              DONE TASKS
            </h1>
            {doneTasks?.map((task, index) => (
              <TaskCard
                key={index}
                task={task}
                toggleTask={() => toggleTask(task.id)} // ส่ง task.id ไป
                deleteTask={() => deleteTask(task.id)}
              />
            ))}
          </div>
        </>
      ) : null}{" "}
    </>
  );
};

export default TaskContainer;

interface TaskCardProps {
  task: TaskData;
  toggleTask: () => void;
  deleteTask: () => void; // เพิ่ม prop สำหรับฟังก์ชันการลบ task
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  toggleTask,
  deleteTask,
}) => {
  const priorityColors = {
    high: "bg-[#fc8a00]",
    normal: "bg-[#008afc]",
    done: "bg-green-500",
  };

  const priorityText = (task) => {
    if (task.done) {
      return "DONE";
    }
    if (task.priority === "high") {
      return "HIGH PRIORITY";
    } else {
      return "NORMAL PRIORITY";
    }
  };

  return (
    <div
      className={`mb-2.5 pt-3 pb-3 pl-2 pr-2 rounded-lg flex justify-between items-center text-white ${task.done ? priorityColors.done : priorityColors[task.priority]}`}
    >
      <div className="max-w-40">
        <p className="text-xs font-bold">{priorityText(task)}</p>
        <p className="font-bold text-lg">{task.text}</p>
        <p className="text-xs opacity-80">{task.desc}</p>
      </div>
      <div className="flex space-x-2 items-center">
        <button
          onClick={toggleTask}
          className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center bg-white cursor-pointer"
        >
          {task.done && <span className="text-xs text-green-700">✔</span>}
        </button>
        {/* ปุ่มลบ */}
        <button
          onClick={deleteTask}
          className="w-5 h-5 flex items-center justify-center cursor-pointer"
        >
          <FaTrash className="text-xs text-red-200" />{" "}
          {/* ใช้ไอคอนจาก react-icons */}
        </button>
      </div>
    </div>
  );
};
