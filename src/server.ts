import express, { Express, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const mongoose = require('mongoose');
import filmRoutes from './routes/filmRoutes';
import directorRoutes from './routes/directorRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app: Express = express()
const PORT = 3000

const uri = "mongodb+srv://user:HdI5eK1sZmSZ95vG@cluster0.h4hxl6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
}
run().catch(console.dir);

app.use(express.json())
app.use('/api/films', filmRoutes)
app.use('/api/directors', directorRoutes)
app.use('/api/sessions', sessionRoutes)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})