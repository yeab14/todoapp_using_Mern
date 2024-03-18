import express from "express"
import { addTask, getTask,getTaskById, removeTask,updateTask} from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask); // Route to add a new task
router.get("/getTask", requireAuth, getTask); // Route to get all tasks
router.get("/getTask/:id", requireAuth, getTaskById); // Route to get a task by its ID
router.patch("/updateTask/:id",requireAuth, updateTask); // Route to update a task by its ID
router.delete("/removeTask/:id", requireAuth, removeTask); // Route to remove a task by its ID


export default router;