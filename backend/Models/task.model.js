import mongoose , {Schema, model} from "mongoose";


const taskSchema = new Schema({
     taskName: {
          type: String,
          required: true 
     }, 
     isDone: {
          type: Boolean,
          required: true
     }
},{ timestamps: true } );

const Task = model("todos", taskSchema);
export default Task;
