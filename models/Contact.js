// models/Contact.js

let mongoose = require('mongoose');

// DB schema
let contactSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  email: {type: String},
  phone: {type: String},
});
// model 만들기
let Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
