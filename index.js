const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/note');

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

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete('/api/notes/:id', (req, res, next) => {
	Note.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

const generateId = () => {
	const maxId =
		notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
	return maxId + 1;
};

app.post('/api/notes', (request, response) => {
	const body = request.body;

	if (body.content === undefined) {
		return response.status(400).json({ error: 'content missing' });
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	note.save().then((savedNote) => {
		response.json(savedNote);
	});
});

app.put('/api/notes/:id', (request, response, next) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.log(error);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}
	next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
