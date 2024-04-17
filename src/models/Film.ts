import { Schema } from "mongoose";
import { IDirector } from "./Director";

export interface IFilm { 
    title: string; 
    releaseYear: number; 
    genre: string; 
    directors: IDirector[];
}

export const filmSchema = new Schema({
    title: String,
    releaseYear: Number,
    genre: String,
    directors: [{ type: Schema.Types.ObjectId, ref: 'Director' }]
})