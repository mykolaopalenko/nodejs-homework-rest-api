const { HttpError } = require('../helpers');
const { listContacts, getContactById, removeContact, addContact, updateContact, } = require("../models/contacts")


async function getContacts(req, res) {
   const contacts = await listContacts();
   res.json(contacts)
}

async function getContact(req, res, next) {
   const { contactId } = req.params;
   const contact = await getContactById(contactId);
   if (contact) {
      return res.json(contact)
   }
   return next(HttpError(404, "Contact not found"))
}

async function createContact(req, res) {
   const contact = req.body
   const newContact = await addContact(contact)
   return res.status(201).json(newContact)
}

async function deleteContact(req, res, next) {
   const { contactId } = req.params;
   const contact = await getContactById(contactId);
   if (!contact) {
      return next(HttpError(404, "Not found"))
   }
   await removeContact(contactId)

   return res.status(200).json({ message: 'contact deleted' })

}



async function updContact(req, res, next) {
   const { contactId } = req.params
   const contactBody = req.body
   const contact = await updateContact(contactId, contactBody)
   if (contact) {
      return res.status(200).json(contact)
   }
   res.status(404).json({ "message": "Not found" })
}

module.exports = {
   getContacts,
   getContact,
   createContact,
   deleteContact,
   updContact,
}