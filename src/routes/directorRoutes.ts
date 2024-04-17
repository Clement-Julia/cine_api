import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IDirector, directorSchema } from '../models/Director';

const directorModel = mongoose.model('Director', directorSchema);
const router = Router();

/**
    * @swagger
    * /directors:
    *   get:
    *     description: Get all directors
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Director'
    */
router.get('/', async (req: Request, res: Response) => {
	let allDirectors = await directorModel.find();
	res.status(200).json(allDirectors);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const director = await directorModel.findById(req.params.id);
		if (director) {
			res.status(200).json(director);
		} else {
			res.status(404).send('Director not found');
		}
	} catch (err) {
		res.status(500).send('Error finding director');
	}
});

router.post('/', async (req: Request, res: Response) => {
	const director: IDirector = req.body;
	try {
		const birthDate = new Date(director.birthDate);
		if (isNaN(birthDate.getTime())) {
			throw new Error('Invalid date format');
		}
		let oneDirectorModel = new directorModel({
			name: director.name,
			birthDate: birthDate,
			biography: director.biography,
		});
		await oneDirectorModel.save();
		res.status(201).send('Director added');
	} catch (err) {
		res.status(500).send('Error adding director');
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedDirector: IDirector = req.body;
	try {
		await directorModel.findByIdAndUpdate(req.params.id, updatedDirector);
		res.status(200).send('Director updated');
	} catch (err) {
		res.status(500).send('Error updating director');
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await directorModel.findByIdAndDelete(req.params.id);
		res.send('Director deleted');
	} catch (err) {
		res.status(500).send('Error deleting director');
	}
});

export default router