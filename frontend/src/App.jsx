import React, { useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import api from './configs/api.js'
import { notify } from './utils/toast.js';




const App = () => {

     const [loading, setLoading] = React.useState(true);
     const [input, setInput] = React.useState('');
     const [tasks, setTasks] = React.useState([]);
     const [copyTasks, setCopyTasks] = React.useState([]);
     const [updateTask, setUpdateTask] = React.useState('');
     const [updateTaskId, setUpdateTaskId] = React.useState('');
     const inputRef = useRef(null);


     const handleAddTask = async () => {

          if (input.trim() === '') {

               notify('Task cannot be empty', 'error')

          } else if (updateTask === '' && input.trim() !== '') {
               // in this case user is trying to add a new task
               const obj = {
                    taskName: input,
                    isDone: false
               }
               const response = await api.post('/tasks', obj);
               const { success, message } = response.data;
               if (success) {
                    setInput('');
                    fetchAllTasks();
               }

          } else if (updateTask !== '' && input.trim() !== '') {
               // in this case user is trying to update an existing task
               const updatedObj = {
                    taskName: input,
               }

               const response = await api.put(`/tasks/${updateTaskId}`, updatedObj);
               const { success, message } = response.data;
               if (success) {
                    setInput('');
                    setUpdateTask('');
                    setUpdateTaskId('');
                    fetchAllTasks();
               }

          }

     }


     useEffect(() => {
          setInput(updateTask);
     }, [updateTask])



     const fetchAllTasks = async () => {

          const response = await api.get('/tasks', { headers: { skipToast: true } });
          const { data } = response.data;
          setLoading(false);
          setTasks(data);
          setCopyTasks(data);

     }


     useEffect(() => {
          fetchAllTasks();
          setLoading(true);
     }, []);


     const handleDeleteTask = async (id) => {
          const response = await api.delete(`/tasks/${id}`);
          const { success, message } = response.data;
          if (success) {
               fetchAllTasks();
          }
     }


     const handleToggleTaskIsDone = async (task) => {

          const response = await api.patch(`/tasks/toggleIsDone/${task._id}`);
          const { success, message } = response.data;
          if (success) {
               fetchAllTasks();
          }

     }


     const handleUpdateTask = (task) => {
          setUpdateTask(task.taskName);
          setUpdateTaskId(task._id);
          inputRef.current.focus();
     }


     const handleSearch = (e) => {
          const term = e.target.value.toLowerCase();

          if (term === '') {
               setTasks(copyTasks);
               return;
          }

          const filteredTasks = copyTasks.filter((task) =>
               task.taskName.toLowerCase().includes(term)
          );

          setTasks(filteredTasks);
     };


     return (
          <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
               <div className='w-full max-w-xl bg-white shadow-xl rounded-2xl p-6'>

                    {/* Title */}
                    <h1 className='text-2xl font-semibold text-center mb-6 text-gray-800'>
                         Task Manager
                    </h1>

                    {/* Input + Search */}
                    <div className='flex gap-3 mb-6'>

                         {/* Add Task */}
                         <form onSubmit={(e) => {
                              e.preventDefault();
                              handleAddTask();
                         }} className='flex flex-1'>
                              <input
                                   ref={inputRef}
                                   value={input}
                                   onChange={(e) => setInput(e.target.value)}
                                   type="text"
                                   placeholder='Add a new task...'
                                   className='w-full px-4 py-2 border rounded-l-lg focus:outline-none '
                              />
                              <button type='submit' className='cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-lg transition'>
                                   +
                              </button>
                         </form>

                         {/* Search */}
                         <input
                              onChange={handleSearch}
                              type="text"
                              placeholder='Search...'
                              className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                         />
                    </div>

                    {/* Task List */}
                    <div className='space-y-3'>
                         {loading && (
                              <div className='w-full p-2'>
                                   <Skeleton
                                        height={60}
                                        count={4}
                                        baseColor="#e5e7eb"
                                        highlightColor="#f3f4f6"
                                        className='mb-2'
                                   />
                              </div>
                         )}
                         {(tasks && !loading) && tasks.map((task) => (
                              <div key={task._id} className='flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition'>

                                   <span className={`text-gray-700 ${task.isDone ? 'line-through text-gray-400' : ''}`}>
                                        {task.taskName}
                                   </span>

                                   {/* Buttons */}
                                   <div className='flex gap-2'>

                                        <button onClick={() => handleToggleTaskIsDone(task)} className='cursor-pointer bg-green-500 hover:bg-green-600 text-white p-2 w-10 rounded-lg transition'>
                                             ✓
                                        </button>

                                        <button onClick={() => handleUpdateTask(task)} className='cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-2 w-10 rounded-lg transition'>
                                             ✎
                                        </button>

                                        <button onClick={() => handleDeleteTask(task._id)} className='cursor-pointer bg-red-500 hover:bg-red-600 text-white p-2 w-10 rounded-lg transition'>
                                             🗑
                                        </button>

                                   </div>
                              </div>
                         ))
                         }
                    </div>

               </div>

               {/* Toast Container */}
               <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} />
          </div>
     )
}

export default App