

import express from 'express';


const router = express.Router()


// Apply admin auth middleware to all other routes
// router.use(dynamicAdminAuth)

// router.use('/user', AdminUserRouter);
;

export const AdminRouter = router