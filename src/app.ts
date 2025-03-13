import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

//parsers
app.use(express.json());
// app.use(cors());


app.use(
  cors({
    origin: 'http://localhost:5173',  // Allow only your frontend origin
    credentials: true,                // Allow cookies and other credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  })
);


// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Blog Server' });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
