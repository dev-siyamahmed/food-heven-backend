import { Router } from 'express';
import { AdminRouter } from '../routes/admin';
import { AuthRouter } from '../routes/auth/auth';
import { UserRouter } from '../routes/user';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/user',
    route: UserRouter,
  },
  {
    path: '/admin',
    route: AdminRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
