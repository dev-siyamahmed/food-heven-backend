

/**
 * MIGRATION: This file has been migrated to use dynamic authentication
 * Date: 2024-08-02
 * See docs/guides/dynamic-auth-upgrade.md for details
 */

import express from 'express';


const router = express.Router();

// Then apply authentication middleware for protected routes
// router.use(dynamicUserOnlyAuth);
// router.use('/ticket', TicketRouter);


export const UserRouter  = router