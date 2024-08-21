import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id {**${contactId}**}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    contactType: req.body.contactType,
    userId: req.user._id,
    ...req.body,
  };
  const createdContact = await createContact(contact);

  res.status(201).json({
    status: 201,
    message: 'Contact successfully created!',
    data: createdContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  res.status(204).end();
};

export const upsertContactControlles = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await upsertContact(contactId, req.body, { upsert: true });

  if (!result) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  const status = result.isNew ? 200 : 201;

  res.status(status).json({
    status,
    message: 'Contact is successfully upserted!',
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await upsertContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found!'));
  }

  res.status(200).json({
    status: 200,
    message: 'Contact successfully patched!',
    data: result.contact,
  });
};
