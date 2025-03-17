import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import {
  createTodolist,
  getTodolistByDate,
  updateTodolist,
} from "@/apis/todolist"; // นำเข้า API

export interface TaskData {
  priority: string;
  text: string;
  desc: string;
  done: boolean;
}

interface todolist {
  id: number;
  date: string;
  taskData: [];
}

interface HeaderProps {
  dateString: string;
}

const Header: React.FC<HeaderProps> = ({ dateString }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [dateInfo, setDateInfo] = useState({
    day: "",
    weekday: "",
    month: "",
    year: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับเปิด/ปิด Modal
  const [newTask, setNewTask] = useState<TaskData>({
    priority: "normal", // ค่าเริ่มต้นสำหรับ priority
    text: "",
    desc: "",
    done: false,
  });

  const [todolist, setTodolist] = useState<todolist>({
    id: 0,
    date: "",
    taskData: [],
  }); // สตอร์ข้อมูล Todolist

  useEffect(() => {
    const date = new Date(dateString + "T00:00:00Z"); // ป้องกัน Timezone issue

    setDateInfo({
      day: date.getUTCDate().toString(),
      weekday: date.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC",
      }),
      month: date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      year: date.getUTCFullYear().toString(),
    });
  }, [dateString]);

  useEffect(() => {
    if (isModalOpen) {
      // เรียกใช้งาน API เพื่อนำข้อมูล Todolist ของวันที่ที่เลือก
      const fetchTodolist = async () => {
        const localuser = JSON.parse(localStorage.getItem("user"));
        console.log(localuser);
        const data = await getTodolistByDate(dateString, localuser.username);
        if (data) {
          setTodolist(data);
        } else {
          const data = await createTodolist(dateString, localuser.username);
          setTodolist(data);
        }
      };

      fetchTodolist();
    }
  }, [isModalOpen]);

  const handleNewTaskClick = () => {
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // ปิด Modal
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewTask((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!newTask.text || !newTask.desc) {
      console.error("Task title and description cannot be empty");
      return;
    }

    const newTaskFormatted = `{priority: '${newTask.priority}', text: '${newTask.text}', desc: '${newTask.desc}', done: ${newTask.done}}`;
    let data = newTaskFormatted;
    if (todolist.taskData.length > 0 && todolist.taskData[0] !== "") {
      data = todolist.taskData[0] + "," + newTaskFormatted;
    }

    const taskData = [data];

    // ส่ง taskData เป็น array ของ jsonb
    const newTodolist = await updateTodolist(todolist.id, taskData);

    if (newTodolist) {
      console.log("New Task Added:", newTodolist);
      window.location.reload();
      setIsModalOpen(false);
      setNewTask({
        priority: "normal",
        text: "",
        desc: "",
        done: false,
      });
    }
  };

  return (
    <div className="flex flex-row items-center justify-between text-black pb-4">
      <div className="flex flex-row items-center">
        <h1 className="text-3xl font-bold ">{dateInfo.day}</h1>
        <div className="flex flex-col text-xs font-semibold ml-1">
          <span>{dateInfo.weekday}</span>
          <span>
            {dateInfo.month} {dateInfo.year}
          </span>
        </div>
      </div>
      <button
        className="flex flex-row items-center justify-center"
        onClick={handleNewTaskClick}
      >
        <FaPlusCircle className="text-xs text-pink-500 mr-1" />
        <span className="text-xs font-bold">NEW TASK</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">New Task</h2>

            <input
              type="text"
              name="text"
              value={newTask.text}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Task Title"
            />
            <input
              type="text"
              name="desc"
              value={newTask.desc}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Task Description"
            />

            {/* Priority Select */}
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
