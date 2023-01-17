const express = require('express');
const { tryCatchWrapper } = require('../../helpers');
const router = express.Router()
const { getContacts, getContact, createContact, deleteContact, updContact, updateStatusContact } = require("../../controllers/contacts.controller")
const { validateBody } = require("../../middlewares/validateBody")
const { addContactSchema, updateContactSchema, updateStatusSchema } = require("../../schemas/contacts")

router.get('/', tryCatchWrapper(getContacts))

router.get('/:contactId', tryCatchWrapper(getContact))

router.post('/', validateBody(addContactSchema), tryCatchWrapper(createContact))

router.delete('/:contactId', tryCatchWrapper(deleteContact))

router.put('/:contactId', validateBody(updateContactSchema), tryCatchWrapper(updContact))

router.patch("/:contactId/favorite", validateBody(updateStatusSchema), tryCatchWrapper(updateStatusContact));

module.exports = router
