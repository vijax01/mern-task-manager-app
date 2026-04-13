// create router with react
import { Router } from 'express';
const router = Router();


// import all the controllers
import { createTask, fetchAllTasks, updateTaskById, deleteTaskById, toggleTaskIsDone  } from '../Controllers/TaskController.js';


// all the routes are here
router.get('/', fetchAllTasks);
router.post('/', createTask);
router.put('/:id', updateTaskById);
router.patch('/toggleIsDone/:id', toggleTaskIsDone);
router.delete('/:id', deleteTaskById);



export default router; 