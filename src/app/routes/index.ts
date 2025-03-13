import { Router } from 'express';
import { AuthRoute } from '../modules/auth/auth.route';
import { AdminRoute } from '../modules/admin/admin.route';
import { UserRoute } from '../modules/user/userRouter';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/admin',
    route: AdminRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
