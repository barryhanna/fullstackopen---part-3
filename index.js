const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const url = `mongodb+srv://barryahanna:${process.env.MONGO_DB_PASSWORD}@notes.pxqazfi.mongodb.net/noteApp`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Note = mongoose.model('Note', noteSchema);

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		important: true,
	},
	{
		id: 2,
		content: 'Browser can execute only JavaScript',
		important: false,
	},
	{
		id: 3,
		content:
			'GET and POST are the most important methods of HTTP protocol',
		important: true,
	},
];

app.get('/', (req, res) => {
	res.send('<h1>Hello, World!</h1>');
});

app.get('/api/notes', (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes);
	});
});

app.get('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);
	const note = notes.find((note) => note.id === id);
	if (note) {
		res.json(note);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id);
	notes = notes.filter((note) => note.id === id);
	res.status(204).end();
});

const generateId = () => {
	const maxId =
		notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
	return maxId + 1;
};

app.post('/api/notes', (req, res) => {
	const body = req.body;

	if (!body.content) {
		return res.status(400).json({ error: 'content missing' });
	}

	const note = {
		content: body.content,
		important: body.important || false,
		id: generateId(),
	};

	notes = notes.concat(note);
	res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
