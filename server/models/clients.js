const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  CONTACT_ID: Number,
  EMAIL: String,
  LASTNAME: String,
  FIRSTNAME: String,
  SMS: String,
  DOUBLE_OPT_IN: String,
  OPT_IN: String,
  WHATSAPP: String,
  LANDLINE_NUMBER: String,
  ADDED_TIME: Date,
  MODIFIED_TIME: Date,
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
