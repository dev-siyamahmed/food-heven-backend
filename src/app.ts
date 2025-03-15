import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

//parsers
app.use(express.json());
// app.use(cors());

// app.use(cors({
//   origin: "http://localhost:5174",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']; // Add all frontend origins

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT","  PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Blog Server' });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
