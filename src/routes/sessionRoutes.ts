import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { ISession, sessionSchema } from '../models/Session';

const sessionModel = mongoose.model('Session', sessionSchema);
const router = Router();

router.get('/', async (req: Request, res: Response) => {
	let allSessions = await sessionModel.find();
	res.status(200).json(allSessions);
});

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the session
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const session = await sessionModel.findById(req.params.id);
		if (session) {
			res.status(200).json(session);
		} else {
			res.status(404).send('Session not found');
		}
	} catch (err) {
		res.status(500).send('Error finding session');
	}
});

router.post('/', async (req: Request, res: Response) => {
	const session: ISession = req.body;
	try {
		const date = new Date(session.date);
		if (isNaN(date.getTime())) {
			throw new Error('Invalid date format');
		}
        let oneSessionModel = new sessionModel({
            film: session.film,
            date: date,
            time: session.time,
            availableSeats: session.availableSeats,
        });
		await oneSessionModel.save();
		res.status(201).send('Session added');
	} catch (err) {
		res.status(500).send('Error adding session');
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedSession: ISession = req.body;
	try {
		await sessionModel.findByIdAndUpdate(req.params.id, updatedSession);
		res.status(200).send('Session updated');
	} catch (err) {
		res.status(500).send('Error updating session');
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await sessionModel.findByIdAndDelete(req.params.id);
		res.send('Session deleted');
	} catch (err) {
		res.status(500).send('Error deleting session');
	}
});

export default router