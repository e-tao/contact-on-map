const axios = require("axios");
const db = require("./db");

const apiKey = "d3882bb4f3c5d1711938443255e24f37";
const apiUrl = "http://api.positionstack.com/v1/forward?access_key=";

let Contact = {};

Contact.addContact = async (contact) => {
  const query =
    "INSERT INTO contact (name, email, phone, address, lat, lng) VALUES (?,?,?,?,?,?)";

  // get the geo location when add contact
  let geoInfo = await getGeoInfo(contact.address);
  // console.log(geoQueryResult.data.data[0].latitude);
  let lng = geoInfo[0];
  let lat = geoInfo[1];

  const data = [
    contact.name,
    contact.email,
    contact.phone,
    contact.address,
    lat,
    lng,
  ];
  try {
    db.run(query, data);
    return { message: "success", geoinfo: geoInfo };
  } catch (err) {
    db.close();
    return;
  }
};

Contact.updContact = async (contact) => {
  const query =
    "UPDATE contact SET name = COALESCE(?,name), email = COALESCE(?,email), phone = COALESCE(?,phone), address = COALESCE(?,address), lat = COALESCE(?,lat), lng = COALESCE(?,lng) WHERE contactId = ?;";
  let geoInfo = await getGeoInfo(contact.address);

  let lng = geoInfo[0];
  let lat = geoInfo[1];

  const data = [
    contact.name,
    contact.email,
    contact.phone,
    contact.address,
    lat,
    lng,
    contact.contactId,

  ];

  try {
    db.run(query, data);
    return { message: "success", geoinfo: geoInfo };
  } catch (err) {
    db.close();
    return;
  }
};

Contact.delContact = (contact) => {
  const query = "DELETE FROM contact WHERE contactId=?";
  const data = [contact.contactId];
  console.log(contact.contactId);

  try {
    db.run(query, data);
    return { message: "success" };
  } catch (err) {
    db.close();
    return { message: "failed" };
  }
};

async function getGeoInfo(address) {
  let geoQuery = `${apiUrl}${apiKey}&query=${address}`;
  let geoQueryResult = await axios.get(geoQuery);
  let lat = geoQueryResult.data.data[0].latitude;
  let lng = geoQueryResult.data.data[0].longitude;

  let geoInfo = [lng, lat];
  return geoInfo;
}

module.exports = Contact;
