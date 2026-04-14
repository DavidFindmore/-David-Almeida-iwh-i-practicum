const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

require("dotenv").config();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_ID = "2-201310292";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
 const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=brand_name,fm_car_engine_displacement,fm_price`;
 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };
 try {
  const resp = await axios.get(url, {headers});
  const data = resp.data.results;
  res.render("homepage", {title: "Cars | HubSpot APIs", data});
 } catch (error) {
  console.error(error);
 }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", async (req, res) => {
 try {
  res.render("updates", {
   title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
 } catch (error) {
  console.error(error);
 }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
 const {brand_name, fm_car_engine_displacement, fm_price} = req.body;
 const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };
 const newRecord = {
  properties: {
   brand_name,
   fm_car_engine_displacement,
   fm_price,
  },
 };
 try {
  await axios.post(url, newRecord, {headers});
  res.redirect("/");
 } catch (error) {
  console.error(error);
 }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
