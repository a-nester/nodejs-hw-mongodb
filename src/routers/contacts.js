import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  upsertContactControlles,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(createContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.put('/:contactId', ctrlWrapper(upsertContactControlles));

router.patch('/:contactId', ctrlWrapper(patchContactController));

export default router;
