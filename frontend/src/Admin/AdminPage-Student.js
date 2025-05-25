import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage-Student.css';
import logo from '../logo.png';
import background from '../bg.png';

const AdminPageStudent = () => {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        name: '',
        studentNumber: '',
        course: '',
        section: '',
        email: ''
    });
    const [isLogOutVisible, setIsLogOutVisible] = useState(false);

    const API_BASE_URL = 'http://localhost:3001/api/students';

    // Fetch students from backend
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const toggleLogOutVisibility = () => {
        setIsLogOutVisible(!isLogOutVisible);
    };

    const handleLogOut = () => {
        navigate('/login');
    };

    const handleAddStudentClick = () => {
        setIsAdding(true);
        setIsEditing(false);
        setNewStudent({
            name: '',
            studentNumber: '',
            course: '',
            section: '',
            email: ''
        });
    };

    const handleEditStudentClick = (student) => {
        setIsEditing(true);
        setIsAdding(false);
        setCurrentStudent(student);
        setNewStudent({ ...student });
    };

    const handleNewStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleAddStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_BASE_URL, newStudent);
            setStudents(prev => [...prev, response.data]);
            setIsAdding(false);
            setNewStudent({ name: '', studentNumber: '', course: '', section: '', email: '' });
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleEditStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_BASE_URL}/${currentStudent.id}`, newStudent);
            const updated = students.map((s) => s.id === currentStudent.id ? response.data : s);
            setStudents(updated);
            setIsEditing(false);
            setCurrentStudent(null);
            setNewStudent({ name: '', studentNumber: '', course: '', section: '', email: '' });
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            setStudents(students.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
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
                    <button className="nav-button">STUDENTS</button>
                </nav>
            </div>

            <div className="student-section">
                <div className="student-header-row">
                    <h2>Student</h2>
                    <button className="add-button" onClick={handleAddStudentClick}>
                        Add Student +
                    </button>
                </div>

                <h3>Student List</h3>
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NAME</th>
                            <th>STUDENT NUMBER</th>
                            <th>COURSE</th>
                            <th>SECTION</th>
                            <th>EMAIL</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>{student.studentNumber}</td>
                                <td>{student.course}</td>
                                <td>{student.section}</td>
                                <td>{student.email}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEditStudentClick(student)}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(isAdding || isEditing) && (
                    <div className="overlay">
                        <div className="floating-form">
                            <h4>{isAdding ? 'Add New Student' : 'Edit Student'}</h4>
                            <form onSubmit={isAdding ? handleAddStudentSubmit : handleEditStudentSubmit}>
                                <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleNewStudentChange} required />
                                <input type="text" name="studentNumber" placeholder="Student Number" value={newStudent.studentNumber} onChange={handleNewStudentChange} required />
                                <input type="text" name="course" placeholder="Course" value={newStudent.course} onChange={handleNewStudentChange} required />
                                <input type="text" name="section" placeholder="Section" value={newStudent.section} onChange={handleNewStudentChange} required />
                                <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleNewStudentChange} required />
                                <button type="submit" className="save-button">
                                    {isAdding ? 'Save Student' : 'Update Student'}
                                </button>
                                <button type="button" className="cancel-button" onClick={() => {
                                    setIsAdding(false);
                                    setIsEditing(false);
                                    setNewStudent({ name: '', studentNumber: '', course: '', section: '', email: '' });
                                }}>
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

export default AdminPageStudent;