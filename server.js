// const express = require('express');
// const { exec } = require('child_process');
// const path = require('path');
// const fs=require('fs');
// const app = express();
// const PORT = 3000;

// //let notes = [];

// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../frontend')));

// if (fs.existsSync(notesFilePath)) {
//     const fileContent = fs.readFileSync(notesFilePath, 'utf8');
//     try {
//         notes = JSON.parse(fileContent);
//     } catch (err) {
//         console.error("❌ Error parsing notes.json. Starting with empty list.");
//         notes = [];
//     }
// }

// // Save notes to file
// function saveNotesToFile() {
//     fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
// }

// app.post('/add-note', (req, res) => {
//     const { content } = req.body;
    
//     // Call Java program to format note
//     exec(`java -cp ${__dirname} NoteFormatter "${content}"`, (err, stdout, stderr) => {
//         if (err) {
//             console.error('Java Error:', stderr);
//             return res.status(500).send('Java formatting failed');
//         }
//         const formattedNote = stdout.trim();
//         notes.push(formattedNote);
//         res.json({ success: true, note: formattedNote });
//     });
// });
// const notes=[];
// app.get('/notes', (req, res) => {
//     res.json({ notes });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log("Serving static files from:", path.join(__dirname, '../frontend'));
// });


const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Path to JSON file
const notesFilePath = path.join(__dirname, 'notes.json');

// Load notes from file at startup
let notes = [];
if (fs.existsSync(notesFilePath)) {
    const fileContent = fs.readFileSync(notesFilePath, 'utf8');
    try {
        notes = JSON.parse(fileContent);
    } catch (err) {
        console.error("❌ Error parsing notes.json. Starting with empty list.");
        notes = [];
    }
}

// Save notes to file
function saveNotesToFile() {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
}

// Add new note
app.post('/add-note', (req, res) => {
    const { content } = req.body;

    exec(`java -cp ${__dirname} NoteFormatter "${content}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Java Error:', stderr);
            return res.status(500).send('Java formatting failed');
        }

        const formattedNote = stdout.trim();
        notes.push(formattedNote);
        saveNotesToFile(); // Save to file
        res.json({ success: true, note: formattedNote });
    });
});

// Get all notes
app.get('/notes', (req, res) => {
    res.json({ notes });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
   // console.log("📂 Serving frontend from:" ${path.join(__dirname, '../frontend')});
});