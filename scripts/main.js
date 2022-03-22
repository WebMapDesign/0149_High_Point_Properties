const containerFilteredResults = document.getElementById("filtered-results");
const newContainerLayerControl = document.getElementById(
  "container-layer-control"
);

const newContainerTilesControl = document.getElementById(
  "container-tiles-layer-control"
)

let map = L.map("map", {
  fullScreenControl: true,
  zoomSnap: 0.5,
  attributionControl: false,
});

const startCoordinates = [35.97, -79.995];
const startZoom = 16;

map.setView(startCoordinates, startZoom);

let layerProperties2016;
let layerProperties2017;
let layerProperties2018;
let layerProperties2019;

let tiles_OSM = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(map);

let tiles_Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri &mdash;",
  }
);

let sidebarControlMenu = L.control.sidebar("sidebar-control-menu", {
  position: "right",
  closeButton: false,
  autoPan: false,
});
map.addControl(sidebarControlMenu);
sidebarControlMenu.show();

const fsControl = L.control.fullscreen();
map.addControl(fsControl);

L.easyButton(
  '<span class="star" style="padding:0px;">&starf;</span>',

  function (btn, map) {
    map.setView(startCoordinates, startZoom);
  },
  "Default View"
).addTo(map);

let circleMarker2016 = {
  color: "#000000",
  fillColor: "#ffbb00",
  fillOpacity: 1,
  opacity: 1,
  radius: 10,
  weight: 2,
};

let circleMarker2017 = {
  color: "#000000",
  fillColor: "#ff6200",
  fillOpacity: 1,
  opacity: 1,
  radius: 10,
  weight: 2,
};

let circleMarker2018 = {
  color: "#000000",
  fillColor: "#cc0300",
  fillOpacity: 1,
  opacity: 1,
  radius: 10,
  weight: 2,
};

let circleMarker2019 = {
  color: "#000000",
  fillColor: "#9e0be6",
  fillOpacity: 1,
  opacity: 1,
  radius: 10,
  weight: 2,
};

function onEachFeature(feature, layer) {
  let propertyAddress = feature.properties["Location Address"];
  let propertyREID = feature.properties["REID"];
  let propertyDeedDate = feature.properties["Deed Date"];

  let popupContent = '<p class="popup-text-name">' + propertyAddress + "</p>";

  if (propertyREID) {
    popupContent += '<p class="popup-text-type">REID: ' + propertyREID + "</p>";
  }

  if (propertyDeedDate) {
    popupContent +=
      '<p class="popup-text-other">Deed Date: ' + propertyDeedDate + "</p>";
  }

  layer.bindPopup(popupContent, {
    className: "custom",
    closeButton: true,
  });

  layer.on({
    click: printPropertyHistory,
  });
}

layerProperties2016 = L.geoJson(geojsonPointsProperties, {
  filter: function (feature, layer) {
    if (
      feature.properties["Unnamed: 0"] === "Current" &&
      feature.properties["Deed Date"].includes("2016")
    )
      return true;
  },
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, circleMarker2016);
  },
  onEachFeature: onEachFeature,
}).addTo(map);

layerProperties2017 = L.geoJson(geojsonPointsProperties, {
  filter: function (feature, layer) {
    if (
      feature.properties["Unnamed: 0"] === "Current" &&
      feature.properties["Deed Date"].includes("2017")
    )
      return true;
  },
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, circleMarker2017);
  },
  onEachFeature: onEachFeature,
}).addTo(map);

layerProperties2018 = L.geoJson(geojsonPointsProperties, {
  filter: function (feature, layer) {
    if (
      feature.properties["Unnamed: 0"] === "Current" &&
      feature.properties["Deed Date"].includes("2018")
    )
      return true;
  },
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, circleMarker2018);
  },
  onEachFeature: onEachFeature,
}).addTo(map);

layerProperties2019 = L.geoJson(geojsonPointsProperties, {
  filter: function (feature, layer) {
    if (
      feature.properties["Unnamed: 0"] === "Current" &&
      feature.properties["Deed Date"].includes("2019")
    )
      return true;
  },
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, circleMarker2019);
  },
  onEachFeature: onEachFeature,
}).addTo(map);

let baseLayers1 = {
  "Open Street Map": tiles_OSM,
  "ESRI Satellite": tiles_Esri_WorldImagery,
};

let overlays1 = {};

let baseLayers2 = {};

let overlays2 = {
  "Current Deed Date 2019": layerProperties2019,
  "Current Deed Date 2018": layerProperties2018,
  "Current Deed Date 2017": layerProperties2017,
  "Current Deed Date 2016": layerProperties2016,
};

let layerControlTiles = L.control
  .layers(baseLayers1, overlays1, {
    collapsed: false,
    // position: "topleft",
  })
  .addTo(map);

let layerControlDeedYears = L.control
  .layers(baseLayers2, overlays2, {
    collapsed: false,
  })
  .addTo(map);

// move the layer controls to a custom position
let layerControlHtmlObject = layerControlDeedYears.getContainer();
newContainerLayerControl.appendChild(layerControlHtmlObject);

let layerControlTilesHtmlObject = layerControlTiles.getContainer();
newContainerTilesControl.appendChild(layerControlTilesHtmlObject);


function printPropertyHistory(e) {
  containerFilteredResults.innerHTML = "";

  let selectedREID = e.target.feature.properties["REID"];

  let allFeatures = geojsonPointsProperties.features;

  let filteredFeaturesByREID = allFeatures.filter(
    (feature) => feature["properties"]["REID"] === selectedREID
  );

  // write address
  let newAddress = document.createElement("p");
  newAddress.className = "sidebar-text-name";
  newAddress.innerHTML =
    filteredFeaturesByREID[0].properties["Location Address"];
  containerFilteredResults.appendChild(newAddress);

  // write REID
  let newREID = document.createElement("p");
  newREID.className = "sidebar-text-type";
  newREID.innerHTML = "REID: " + filteredFeaturesByREID[0].properties["REID"];
  containerFilteredResults.appendChild(newREID);

  // write PIN
  let newPIN = document.createElement("p");
  newPIN.className = "sidebar-text-type";
  newPIN.innerHTML = "PIN: " + filteredFeaturesByREID[0].properties["PIN"];
  containerFilteredResults.appendChild(newPIN);

  // create separation line at bottom
  let separationLineTop = document.createElement("p");
  separationLineTop.className = "separation-centered";
  separationLineTop.innerHTML = "----------------------------------------";
  containerFilteredResults.appendChild(separationLineTop);

  filteredFeaturesByREID.forEach((feature) => {
    // write owner name
    let newOwnerName = document.createElement("p");
    newOwnerName.className = "sidebar-text-other";
    newOwnerName.innerHTML = "Owner: " + feature.properties["Owner Name"];
    containerFilteredResults.appendChild(newOwnerName);

    // write deed date
    let newDeed = document.createElement("p");
    newDeed.className = "sidebar-text-other";
    newDeed.innerHTML = "Deed Date: " + feature.properties["Deed Date"];
    containerFilteredResults.appendChild(newDeed);

    // write deed type
    let newDeedType = document.createElement("p");
    newDeedType.className = "sidebar-text-other";
    newDeedType.innerHTML = "Deed Type: " + feature.properties["Deed Type"];
    containerFilteredResults.appendChild(newDeedType);

    // write percent ownership
    let newPercentOwnership = document.createElement("p");
    newPercentOwnership.className = "sidebar-text-other";
    newPercentOwnership.innerHTML =
      "Ownership: " + feature.properties["% Ownership"] + "%";
    containerFilteredResults.appendChild(newPercentOwnership);

    // write sale price
    let newSalePrice = document.createElement("p");
    newSalePrice.className = "sidebar-text-other";
    newSalePrice.innerHTML = "Sale Price: " + feature.properties["Sale Price"];
    containerFilteredResults.appendChild(newSalePrice);

    // create separation line at bottom
    let separationLine = document.createElement("p");
    separationLine.className = "separation-centered";
    separationLine.innerHTML = "----------------------------------------";
    containerFilteredResults.appendChild(separationLine);
  });
}
