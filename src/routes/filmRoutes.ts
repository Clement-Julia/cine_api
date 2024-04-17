import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IFilm, filmSchema } from '../models/Film';

const filmModel = mongoose.model('Film', filmSchema);
const router = Router();

router.get('/', async (req: Request, res: Response) => {
	let allFilms = await filmModel.find();
	res.status(200).json(allFilms);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const film = await filmModel.findById(req.params.id);
		if (film) {
			res.status(200).json(film);
		} else {
			res.status(404).send('Film not found');
		}
	} catch (err) {
		res.status(500).send('Error finding film');
	}
});

router.post('/', async (req: Request, res: Response) => {
	const film: IFilm = req.body;
	try {
		let oneFilmModel = new filmModel({
            title: film.title,
            releaseYear: film.releaseYear,
            genre: film.genre,
            directors: film.directors,
		});
		await oneFilmModel.save();
		res.status(201).send('Film added');
	} catch (err) {
		res.status(500).send('Error adding film');
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedFilm: IFilm = req.body;
	try {
		await filmModel.findByIdAndUpdate(req.params.id, updatedFilm);
		res.status(200).send('Film updated');
	} catch (err) {
		res.status(500).send('Error updating film');
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await filmModel.findByIdAndDelete(req.params.id);
		res.send('Film deleted');
	} catch (err) {
		res.status(500).send('Error deleting film');
	}
});

export default router