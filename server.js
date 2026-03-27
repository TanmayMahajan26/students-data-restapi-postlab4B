const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simple logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

let students = [
    { id: 1, name: "Alice Johnson", branch: "Computer Science", year: "3rd" },
    { id: 2, name: "Bob Smith", branch: "Mechanical Engineering", year: "2nd" }
];

// GET /students → Get all students
app.get('/students', (req, res) => {
    res.json(students);
});

// GET /students/:id → Get a specific student
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Student not found');
    res.json(student);
});

// POST /students → Add a new student
app.post('/students', (req, res) => {
    const { name, branch, year } = req.body;
    if (!name || !branch || !year) return res.status(400).send('All fields are required');
    
    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name,
        branch,
        year
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// PATCH /students/:id → Update student details
app.patch('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Student not found');

    const { name, branch, year } = req.body;
    if (name) student.name = name;
    if (branch) student.branch = branch;
    if (year) student.year = year;

    res.json(student);
});

// DELETE /students/:id → Delete a student
app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Student not found');

    const deletedStudent = students.splice(index, 1);
    res.json(deletedStudent[0]);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});
