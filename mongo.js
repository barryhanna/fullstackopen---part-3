const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');

mongoose.connect(MONGODB_URI);

const noteSchema = new mongoose.Schema({
	content: String,
	importamt: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
	content: 'HTML is Easy',
	important: true,
});

const note2 = new Note({
	content: 'CSS is Easy',
	important: true,
});

// Note.find({}).then((result) => {
// 	result.forEach((note) => {
// 		console.log(note);
// 	});
// 	mongoose.connection.close();
// });

note.save().then((result) => {
	console.log('note saved!');
	mongoose.connection.close();
});

note2.save().then((result) => {
	console.log('note saved!');
	mongoose.connection.close();
});
