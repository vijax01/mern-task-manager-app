import React, { useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import api from './api'
import { notify } from './utils/util';




const App = () => {


     const [input, setInput] = React.useState('');
     const [tasks, setTasks] = React.useState([]);
     const [copyTasks, setCopyTasks] = React.useState([]);
     const [updateTask, setUpdateTask] = React.useState('');
     const [updateTaskId, setUpdateTaskId] = React.useState('');
     const inputRef = useRef(null);


     const handleAddTask = async () => {


          if (updateTask === '' && input.trim() !== '') {
               // in this case user is trying to add a new task
               const obj = {
                    taskName: input,
                    isDone: false
               }
               try {
                    const response = await api.post('/tasks', obj);
                    const { success, message } = response.data;
                    if (success) {
                         notify(message, 'success');
                         setInput('');
                         fetchAllTasks();
                    } else {
                         notify(message, 'error');
                    }
               } catch (error) {
                    console.error(error.response?.data?.message || error.message);
                    notify('Failed to add task', 'error');

               }
          } else if (updateTask !== '' && input.trim() !== '') {
               // in this case user is trying to update an existing task
               const updatedObj = {
                    taskName: input,
               }
               try {
                    const response = await api.put(`/tasks/${updateTaskId}`, updatedObj);
                    const { success, message } = response.data;
                    if (success) {
                         notify(message, 'success');
                         setInput('');
                         setUpdateTask('');
                         setUpdateTaskId('');
                         fetchAllTasks();
                    } else {
                         notify(message, 'error');
                    }
               } catch (error) {
                    console.error(error.response?.data?.message || error.message);
                    notify('Failed to update task', 'error');
               }
          }

     }


     useEffect(() => {
          setInput(updateTask);
     }, [updateTask])



     const fetchAllTasks = async () => {
          try {
               const response = await api.get('/tasks');
               const { data } = response.data;
               setTasks(data);
               setCopyTasks(data);
          } catch (error) {
               console.error(error.response?.data?.message || error.message);
               notify('Failed to fetch tasks', 'error');
          }
     }


     useEffect(() => {
          fetchAllTasks();
     }, []);


     const handleDeleteTask = async (id) => {
          try {
               const response = await api.delete(`/tasks/${id}`);
               const { success, message } = response.data;
               if (success) {
                    notify(message, 'success');
                    fetchAllTasks();
               } else {
                    notify(message, 'error');
               }
          } catch (error) {
               console.error(error.response?.data?.message || error.message);
               notify('Failed to delete task', 'error');
          }
     }


     const handleToggleTaskIsDone = async (task) => {
          try {
               const response = await api.patch(`/tasks/toggleIsDone/${task._id}`);
               const { success, message } = response.data;
               if (success) {
                    notify(message, 'success');
                    fetchAllTasks();
               } else {
                    notify(message, 'error');
               }
          } catch (error) {
               console.error(error.response?.data?.message || error.message);
               notify('Failed to toggle task status', 'error');
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
                         {
                              tasks.map((task) => (
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