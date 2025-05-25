import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage-Prof.css';
import logo from '../logo.png';
import background from '../bg.png';

const AdminPageProf = () => {
    const navigate = useNavigate();

    const [professors, setProfessors] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProfessor, setCurrentProfessor] = useState(null);
    const [newProfessor, setNewProfessor] = useState({
        name: '',
        idNumber: '',
        course: '',
        noOfClass: '',
        email: ''
    });

    const [isLogOutVisible, setIsLogOutVisible] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/api/professors')
            .then((res) => setProfessors(res.data))
            .catch((err) => console.error('Failed to fetch professors:', err));
    }, []);

    const toggleLogOutVisibility = () => {
        setIsLogOutVisible(!isLogOutVisible);
    };

    const handleLogOut = () => {
        navigate('/login');
    };

    const handleAddProfessorClick = () => {
        setIsAdding(true);
        setIsEditing(false);
        setNewProfessor({
            name: '',
            idNumber: '',
            course: '',
            noOfClass: '',
            email: ''
        });
    };

    const handleEditProfessorClick = (prof) => {
        setIsEditing(true);
        setIsAdding(false);
        setCurrentProfessor(prof);
        setNewProfessor({ ...prof });
    };

    const handleNewProfessorChange = (e) => {
        const { name, value } = e.target;
        setNewProfessor({ ...newProfessor, [name]: value });
    };

    const handleAddProfessorSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/professors', newProfessor)
            .then((res) => {
                setProfessors([...professors, res.data]);
                setIsAdding(false);
            })
            .catch((err) => console.error('Failed to add professor:', err));
    };

    const handleEditProfessorSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/professors/${currentProfessor.id}`, newProfessor)
            .then(() => {
                const updatedList = professors.map((prof) =>
                    prof.id === currentProfessor.id ? { ...prof, ...newProfessor } : prof
                );
                setProfessors(updatedList);
                setIsEditing(false);
                setCurrentProfessor(null);
            })
            .catch((err) => console.error('Failed to update professor:', err));
    };

    const handleDeleteProfessor = (id) => {
        axios.delete(`http://localhost:3001/api/professors/${id}`)
            .then(() => {
                setProfessors(professors.filter((prof) => prof.id !== id));
            })
            .catch((err) => console.error('Failed to delete professor:', err));
    };

    return (
        <div
            className="admin-page"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <div className="header-text">
                        <div className="logo-title">Pateros Technological College</div>
                        <div className="sub-title">ONLINE GRADING SYSTEM</div>
                    </div>
                </div>
                <div className="log-out-container">
                    <button className="arrow-button" onClick={toggleLogOutVisibility}></button>
                    {isLogOutVisible && (
                        <button className="log-out-button" onClick={handleLogOut}>
                            Log Out
                        </button>
                    )}
                </div>
            </header>

            <div className="nav-section">
                <nav className="navigation">
                    <button className="nav-button" onClick={() => navigate('/admin')}>PROFESSORS</button>
                    <button className="nav-button" onClick={() => navigate('/student')}>STUDENTS</button>
                </nav>
            </div>

            <div className="professor-section">
                <div className="professor-header-row">
                    <h2>Professor</h2>
                    <button className="add-button" onClick={handleAddProfessorClick}>
                        Add Professor +
                    </button>
                </div>

                <h3>Professor List</h3>

                <table className="professor-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NAME</th>
                            <th>ID NUMBER</th>
                            <th>COURSE</th>
                            <th>NO. OF CLASS</th>
                            <th>EMAIL</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {professors.map((prof, index) => (
                            <tr key={prof.id}>
                                <td>{index + 1}</td>
                                <td>{prof.name}</td>
                                <td>{prof.idNumber}</td>
                                <td>{prof.course}</td>
                                <td>{prof.noOfClass}</td>
                                <td>{prof.email}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEditProfessorClick(prof)}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteProfessor(prof.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(isAdding || isEditing) && (
                    <div className="overlay">
                        <div className="floating-form">
                            <h4>{isAdding ? 'Add New Professor' : 'Edit Professor'}</h4>
                            <form onSubmit={isAdding ? handleAddProfessorSubmit : handleEditProfessorSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={newProfessor.name}
                                    onChange={handleNewProfessorChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="idNumber"
                                    placeholder="ID Number"
                                    value={newProfessor.idNumber}
                                    onChange={handleNewProfessorChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="course"
                                    placeholder="Course"
                                    value={newProfessor.course}
                                    onChange={handleNewProfessorChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="noOfClass"
                                    placeholder="No. of Classes"
                                    value={newProfessor.noOfClass}
                                    onChange={handleNewProfessorChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={newProfessor.email}
                                    onChange={handleNewProfessorChange}
                                    required
                                />
                                <button type="submit" className="save-button">
                                    {isAdding ? 'Save Professor' : 'Update Professor'}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageProf;