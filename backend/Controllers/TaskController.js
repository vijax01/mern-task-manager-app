// TaskController.js is meant to do some specific task

// @ import TaskModel if its mongodb and pool if it is postgres 
// @ db interaction 
// @ export controller functions from here





import TaskModel from "../Models/task.model.js"





// define controller functions here and export them 
export const createTask = async (req, res) => {
     const data = req.body;
     try {
          const model = new TaskModel(data);
          await model.save();
          res.status(201).json({message: 'Task is created' , success: true, type: 'success'})
     } catch {
          res.status(500).json({message: "Failed to create task" , success: false, type: 'error'});
     }
}





export const fetchAllTasks = async (req, res) => {
     try {
          const data = await TaskModel.find({}).sort({ createdAt: -1 });
          res.status(200).json({message: 'All Tasks' , success: true, data, type: 'success'})
     } catch (error) {
          res.status(500).json({message: "Failed to fetch tasks" , success: false, type: 'error'});
     }
}





export const updateTaskById = async (req, res) => {
     try {
          const id = req.params.id;
          const body = req.body;
          await TaskModel.findByIdAndUpdate(id, body, { new: true });
          res.status(200).json({message: 'Task updated' , success: true, type: 'success' })
     } catch {
          res.status(500).json({message: "Failed to update task" , success: false, type: 'error'});
     }
}





export const toggleTaskIsDone = async (req, res) => {
     try {
          const id = req.params.id;
          const task = await TaskModel.findById(id);
          if (!task) {
               return res.status(404).json({message: 'Task not found', success: false, type: 'error'});
          }
          task.isDone = !task.isDone;
          await task.save();
          res.status(200).json({message: 'Task updated' , success: true, type: 'success' })
     } catch {
          res.status(500).json({message: "Failed to update task" , success: false, type: 'error'});
     }
}






export const deleteTaskById = async (req, res) => {
     try {
          const id = req.params.id;
          await TaskModel.findByIdAndDelete(id);
          res.status(200).json({message: 'Task is Deleted' , success: true, type: 'success' })
     } catch {
          res.status(500).json({message: "Failed to delete task" , success: false, type: 'error'});
     }
}