import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const sendMail = (email, subject, title, description) => {
    var transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'yeab149@gmail.com',
        to: email,
        subject: subject,
        html:`<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
// add task controller
const addTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        const user = await userModel.findById(userId); // Assuming userId is unique
        const newTask = new taskModel({ title, description, completed: false, userId });

        // Save the new task
        await newTask.save();

        // Send email notification
        sendMail(user.email, "Task Added", title, description);

        // Send response with generated task ID
        res.status(200).json({ message: "Task added successfully", taskId: newTask._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

 //get task controller 
const getTask = (req, res) => {
    taskModel.find({ userId: req.user.id })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(501).json({ message: error.message }))
}

//get task by ID controller 
const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id; // Get task ID from URL parameter
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// update task controller 
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id; // Get task ID from URL parameter
        const { title, description, completed } = req.body;

        // Find the task by id
        const task = await taskModel.findById(taskId);

        // Check if the task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update task properties
        if (title) task.title = title;
        if (description) task.description = description;
        if (completed !== undefined) task.completed = completed;

        // Save the updated task
        await task.save();

        // Send response
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//remove task controller 
const removeTask = (req, res) => {
    const taskId = req.params.id; // Get task ID from URL parameter
    taskModel.findByIdAndDelete(taskId)
        .then(() => res.status(200).json({ message: "Task deleted successfully" }))
        .catch((error) => res.status(500).json({ message: error.message }));
}

export { addTask, getTask, getTaskById, removeTask, updateTask };

