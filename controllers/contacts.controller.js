const { HttpError } = require('../helpers');

const { Contact } = require("../models/contacts")


async function getContacts(req, res) {
   const { _id: owner} = req.user
   const contacts = await Contact.find({owner});
   res.json(contacts)
}

async function getContact(req, res, next) {
   const { contactId } = req.params;
   const contact = await Contact.findById(contactId);
   if (contact) {
      return res.json(contact)
   }
   return next(HttpError(404, "Contact not found"))
}

async function createContact(req, res) {
   const contact = req.body
   const { _id: owner } = req.user
   const newContact = await Contact.create({ ...contact, owner })
   return res.status(201).json(newContact)
}

async function deleteContact(req, res, next) {
   const { contactId } = req.params;
   const contact = await Contact.findById(contactId);
   if (!contact) {
      return next(HttpError(404, "Not found"))
   }
   await Contact.findByIdAndRemove(contactId)

   return res.status(200).json({ message: 'contact deleted' })

}

async function updContact(req, res, next) {
   const { contactId } = req.params;
   const contactBody = req.body
   const contact = await Contact.findByIdAndUpdate(contactId, contactBody, {
      new: true,
   })
   if (contact) {
      return res.status(200).json(contact)
   }
   res.status(404).json({ "message": "Not found" })
}

async function updateStatusContact(req, res, next) {
   const { contactId } = req.params;
   const contactBody = req.body;

   const status = await Contact.findByIdAndUpdate(contactId, contactBody, {
      new: true,
   })
   if (status) {
      return res.status(200).json(status)
   }
   res.status(404).json({ "message": "Not found" })

}

module.exports = {
   getContacts,
   getContact,
   createContact,
   deleteContact,
   updContact,
   updateStatusContact
}