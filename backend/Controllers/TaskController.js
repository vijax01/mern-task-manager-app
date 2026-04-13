import TaskModel from "../Models/task.model.js"





export const createTask = async (req, res) => {
     const data = req.body;
     try {
          const model = new TaskModel(data);
          await model.save();
          res.status(201).json({message: 'Task is created' , success: true})
     } catch {
          res.status(500).json({message: "Failed to create task" , success: false});
     }
}





export const fetchAllTasks = async (req, res) => {
     try {
          const data = await TaskModel.find({}).sort({ createdAt: -1 });
          res.status(200).json({message: 'All Tasks' , success: true, data})
     } catch (error) {
          res.status(500).json({message: "Failed to fetch tasks" , success: false});
     }
}





export const updateTaskById = async (req, res) => {
     try {
          const id = req.params.id;
          const body = req.body;
          await TaskModel.findByIdAndUpdate(id, body, { new: true });
          res.status(200).json({message: 'Task updated' , success: true })
     } catch {
          res.status(500).json({message: "Failed to update task" , success: false});
     }
}





export const toggleTaskIsDone = async (req, res) => {
     try {
          const id = req.params.id;
          const task = await TaskModel.findById(id);
          if (!task) {
               return res.status(404).json({message: 'Task not found', success: false});
          }
          task.isDone = !task.isDone;
          await task.save();
          res.status(200).json({message: 'Task updated' , success: true })
     } catch {
          res.status(500).json({message: "Failed to update task" , success: false});
     }
}






export const deleteTaskById = async (req, res) => {
     try {
          const id = req.params.id;
          await TaskModel.findByIdAndDelete(id);
          res.status(200).json({message: 'Task is Deleted' , success: true })
     } catch {
          res.status(500).json({message: "Failed to delete task" , success: false});
     }
}