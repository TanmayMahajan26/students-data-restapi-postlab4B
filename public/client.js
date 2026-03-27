const studentForm = document.getElementById('student-form');
const studentList = document.getElementById('student-list');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModal = document.getElementById('close-modal');

const API_URL = '/students';

// Fetch all students
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

// Render student cards
function renderStudents(students) {
    studentList.innerHTML = '';
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'record-card';
        // Add a small random rotation for the "hand-placed" look
        const randomRotate = (Math.random() - 0.5) * 4;
        card.style.setProperty('--random-rotate', randomRotate);
        
        card.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Branch:</strong> ${student.branch}</p>
            <p><strong>Year:</strong> ${student.year}</p>
            <div class="record-actions">
                <button class="action-btn edit-btn" onclick="openEditModal(${student.id}, '${student.name}', '${student.branch}', '${student.year}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        `;
        studentList.appendChild(card);
    });
}

// Add student
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const branch = document.getElementById('branch').value;
    const year = document.getElementById('year').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, branch, year })
        });
        if (response.ok) {
            studentForm.reset();
            fetchStudents();
        }
    } catch (error) {
        console.error('Error adding student:', error);
    }
});

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to remove this record?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchStudents();
        }
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

// Edit student
function openEditModal(id, name, branch, year) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-branch').value = branch;
    document.getElementById('edit-year').value = year;
    editModal.classList.add('active');
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const branch = document.getElementById('edit-branch').value;
    const year = document.getElementById('edit-year').value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, branch, year })
        });
        if (response.ok) {
            editModal.classList.remove('active');
            fetchStudents();
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
});

closeModal.addEventListener('click', () => {
    editModal.classList.remove('active');
});

// Initial fetch
fetchStudents();
