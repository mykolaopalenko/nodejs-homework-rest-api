const express = require('express');
const { tryCatchWrapper } = require('../../helpers');
const router = express.Router()
const { getContacts, getContact, createContact, deleteContact, updContact, updateStatusContact } = require("../../controllers/contacts.controller")
const { authenticate } = require("../../middlewares/authenticate")
const { validateBody } = require("../../middlewares/validateBody")
const { addContactSchema, updateContactSchema, updateStatusSchema } = require("../../schemas/contacts")

router.get('/', authenticate, tryCatchWrapper(getContacts))

router.get('/:contactId', authenticate, tryCatchWrapper(getContact))

router.post('/', authenticate, validateBody(addContactSchema), tryCatchWrapper(createContact))

router.delete('/:contactId', authenticate, tryCatchWrapper(deleteContact))

router.put('/:contactId', authenticate, validateBody(updateContactSchema), tryCatchWrapper(updContact))

router.patch("/:contactId/favorite", authenticate, validateBody(updateStatusSchema), tryCatchWrapper(updateStatusContact));

module.exports = router
