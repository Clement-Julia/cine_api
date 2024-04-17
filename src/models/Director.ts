import { Schema } from "mongoose";

export interface IDirector { 
    name: string; 
    birthDate: Date; 
    biography: string;
}

export const directorSchema = new Schema({
    name: String,
    birthDate: Date,
    biography: String
})