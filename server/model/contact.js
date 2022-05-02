const axios = require("axios").default;
const db = require("./db");
const apiAccess = require("../apiKey");

const apiKey = apiAccess.access.apiKey;
const apiUrl = apiAccess.access.apiUrl;

let Contact = {};

Contact.addContact = async (contact) => {
  // console.log(contact.address);
  const query =
    "INSERT INTO contact (name, email, phone, address, lat, lng) VALUES (?,?,?,?,?,?)";

  // get the geo location when add contact
  let geoInfo = await getGeoInfo(contact.address);
  // console.log(geoQueryResult.data.data[0].latitude);

  const [lng, lat] = geoInfo;

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

  const [lng, lat] = geoInfo;

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
  // const options = {
  //   method: 'get',
  //   headers: {
  //     "Content-Type": "application/json; charset=UTF-8",
  //     'User-Agent': 'Mozilla/5.0',
  //   }
  // }

  let geoQuery = `${apiUrl}${apiKey}&query=${address}&limit=1`;
  let geoQueryResult = await axios.get(geoQuery);

  console.log(geoQueryResult);
  let lat = geoQueryResult.data.data[0].latitude;
  let lng = geoQueryResult.data.data[0].longitude;

  let geoInfo = [lng, lat];
  // let geoInfo = [0,0];
  return geoInfo;
}

module.exports = Contact;
