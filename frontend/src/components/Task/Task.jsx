import React, { useContext } from 'react';
import moment from 'moment';
import "./task.css";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import TaskContext from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom'; 

function Task({ task, id }) {
    const { dispatch } = useContext(TaskContext); 
    const navigate = useNavigate();

    const handleRemove = (e) => {
        e.preventDefault();
        dispatch({
            type: "REMOVE_TASK",
            id
        });
    }

    const handleMarkDone = (e) => {
        dispatch({
            type: "MARK_DONE",
            id
        });
    }

    return (
        <div className='bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3'>
            <div className="mark-done">
                <input type="checkbox" className="checkbox" onChange={handleMarkDone} checked={task.completed} />
            </div>
            <div className="task-info text-slate-900 text-sm w-10/12">
                <h4 className="task-title text-lg capitalize">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className='italic opacity-60'>
                    {
                        task?.createdAt ? (
                            <p>{moment(task.createdAt).fromNow()}</p>
                        ) : (
                            <p>just now</p>
                        )
                    }
                </div>
            </div>
            <div className="update-task text-sm text-white">
                {/* Pass title, description, and id to the UpdateTask component */}
                <div onClick={() => navigate(`/update/${id}`, { state: { title: task.title, description: task.description, id } })} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <UpdateIcon style={{ fontSize: 30 }} className="update-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1" />
                </div>
            </div>
            
            <div className="remove-task text-sm text-white">
                <DeleteIcon style={{ fontSize: 30, cursor: "pointer" }} onClick={handleRemove} className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1" />
            </div>
        </div>
    );
}

export default Task;




