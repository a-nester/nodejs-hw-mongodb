import { Router } from 'express';
import contactsRouter from '../routers/contacts.js';
import authRouter from '../routers/auth.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);

export default router;
