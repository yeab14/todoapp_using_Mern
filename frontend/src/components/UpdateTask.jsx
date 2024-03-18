import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TaskContext from '../context/TaskContext';
import axios from "../Axios/axios.js";
import TokenContext from '../context/TokenContext';

function UpdateTask({ onClose }) {
    const { dispatch } = useContext(TaskContext);
    const {userToken} = useContext(TokenContext)
    const location = useLocation(); // Use useLocation hook to get location object
    const { title, description, id } = location.state || {}; // Destructure state object with default empty object

    // Initialize state with the provided task data
    const [updatedTitle, setUpdatedTitle] = useState(title || "");
    const [updatedDescription, setUpdatedDescription] = useState(description || "");

    // Set initial state values using data passed from Task component
    useEffect(() => {
        if (title && description) {
            setUpdatedTitle(title);
            setUpdatedDescription(description);
        }
    }, [title, description]);

    // Function to handle form submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Make API call to update task with proper headers
            const response = await axios.patch(
                `/task/updateTask/${id}`, 
                {
                    title: updatedTitle,
                    description: updatedDescription
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );
    
            // Get the updated task object from the response
            const updatedTask = response.data.task;
    
            // Dispatch action to update task in context using the updated task's ID
            dispatch({
                type: "UPDATE_TASK",
                id: updatedTask._id,
                title: updatedTask.title,
                description: updatedTask.description,
            });
            
            // Close the update form
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <div className="updateContainer md:w-1/3 md:mx-auto mx-3 mt-3 flex justify-center">
            <div className='w-11/12'>
                <form onSubmit={handleUpdate}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={updatedTitle}
                            required
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                    </div>
                    <div className='my-3'>
                        <label htmlFor="description">Description</label>
                        <textarea
                            rows={5}
                            name="description"
                            id="description"
                            value={updatedDescription}
                            required
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            style={{ resize: "none" }}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button
                            type='submit'
                            className='bg-blue-700 rounded-md text-white px-5 py-1'
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateTask;





