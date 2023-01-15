const fs = require("node:fs/promises");
const path = require('path');
const { nanoid } = require('nanoid')

const contactsPath = path.resolve(__dirname, "./contacts.json");

async function writeContacts(contacts) {
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
}

async function listContacts() {
   const result = await fs.readFile(contactsPath);
   return JSON.parse(result);
}

async function getContactById(contactId) {
   const contacts = await listContacts();
   const result = contacts.find(({ id }) => id === contactId);
   return result || null;
}

async function removeContact(contactId) {
   const contacts = await listContacts();
   const index = contacts.findIndex(({ id }) => id === contactId);
   if (index === -1) {
      return null;
   }
   const [result] = contacts.splice(index, 1);
   await writeContacts(contacts);
   return result;
}

async function addContact({ name, email, phone }) {
   const id = nanoid()
   const newContact = { id, name, email, phone };
   const contacts = await listContacts();
   const newContacts = [...contacts, newContact];
   await writeContacts(newContacts);
   return newContact;
}

const updateContact = async (contactId, body) => {
   const contacts = await listContacts()
   const index = contacts.findIndex((contact) => contact.id === contactId)

   if (index !== -1) {
      const updContact = { id: contactId, ...contacts[index], ...body }
      contacts[index] = updContact
      await writeContacts(contacts)
      return updContact
   }

   return null
};

module.exports = {
   listContacts,
   getContactById,
   removeContact,
   addContact,
   updateContact,
}
