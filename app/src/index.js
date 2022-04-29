import "./css/styles.css";
import layoutTemplate from "./hbs/layout.hbs";
import mapTemplate from "./hbs/map.hbs";
import contactTemplate from "./hbs/contacts.hbs";
import editTemplate from "./hbs/edit.hbs";

const appEl = document.getElementById("app");
const siteInfo = { title: "Contacts and their Geolocations" };
window.document.title = siteInfo.title;
appEl.innerHTML = layoutTemplate(siteInfo);

const mapEl = document.getElementById("map-container");
const contactEl = document.getElementById("contact-list");
const editEl = document.getElementById("contact-edit");
mapEl.innerHTML = mapTemplate();
editEl.innerHTML = editTemplate();

let btnAdd = document.getElementById("btnAdd");
let btnUpd = document.getElementById("btnUpd");
let update = false;
let contactId = 0;

const queryUrl = "http://localhost:3000/contacts";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZS10YW8iLCJhIjoiY2wya2g1ZWNzMTUxdjNjbGE3dG4yb3JoaiJ9._ZL2oB8k_zke9ldXSpn67w";

let map;

let mapInit = async function () {
  map = new mapboxgl.Map({
    container: "map-container", // container ID
    style: "mapbox://styles/e-tao/cl2fg7qd0000e14mmjkrnmf14", // style URL
    center: [-75.765, 45.456], // starting position [lng, lat]
    zoom: 13, // starting zoom
  });
};

mapInit();

let getContacts = async function () {
  let contactLists = await (await fetch(queryUrl)).json();
  let geoList = [];

  for (let i = 0; i < contactLists.length; i++){
    geoList.push([contactLists[i].lng, contactLists[i].lat])
  }
  Locateuser(geoList);
  // console.log(geoList);

  contactEl.innerHTML = contactTemplate(contactLists);
  removeContact();
  updateContact();
  // console.log(contactLists);
};

getContacts();

btnAdd.addEventListener("click", async () => {
  let newContact = getInputs(update);

  let response = await (await fetch(queryUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(newContact),
  })).json();

  let geoCoord = response.geoinfo;

  Locateuser(geoCoord);

  getContacts();
  clearInputs();
});

btnUpd.addEventListener("click", async () => {
  update = true;
  let updated = getInputs(update);

  let response = await fetch(queryUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(updated),
  });

  let geoCoord = (await response.json()).geoinfo;

  Locateuser(geoCoord);
  getContacts();
  clearInputs();
});

function getInputs(update) {
  let inputs = document.getElementsByClassName("contact-form");
  let newContact = {};
  if (!update) {
    newContact = {
      name: inputs[0].value,
      email: inputs[1].value,
      phone: inputs[2].value,
      address: inputs[3].value,
    };
  } else {
    newContact = {
      name: inputs[0].value,
      email: inputs[1].value,
      phone: inputs[2].value,
      address: inputs[3].value,
      contactId: contactId,
    };
  }
  // console.log(contactId);

  return newContact;
}

function clearInputs() {
  let inputs = document.getElementsByClassName("contact-form");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

function removeContact() {
  let delBtn = document.getElementsByClassName("btnDel");
  let cId = document.getElementsByClassName("cId");

  for (let i = 0; i < delBtn.length; i++) {
    delBtn[i].addEventListener("click", async () => {
      // console.log(`I am button ${cId[i].value}`);
      await fetch(queryUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ contactId: cId[i].value }),
      });
      getContacts();
    });
  }
}

function updateContact() {
  let updBtn = document.getElementsByClassName("btnUpdate");
  let cId = document.getElementsByClassName("cId");
  let inputs = document.getElementsByClassName("contact-form");

  for (let i = 0; i < updBtn.length; i++) {
    updBtn[i].addEventListener("click", async () => {
      // console.log(`update button ${cId[i].value}`);
      contactId = cId[i].value;
      let row = document.getElementById(`${cId[i].value}`);

      for (let i in row.cells) {
        let col = row.cells[i];
        inputs[i].value = col.innerHTML;
      }
    });
  }
}

let Locateuser = function (location) {
  for (let i = 0; i < location.length; i++){
    new mapboxgl.Marker({
      color: "red",
    })
      .setLngLat(location[i])
      .setPopup(new mapboxgl.Popup().setHTML("<h4>your friend is here</h4>"))
      .addTo(map);
  }
  map.setCenter(location[0]);
};
