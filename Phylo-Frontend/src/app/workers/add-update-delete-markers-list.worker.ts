/**
 * @file Worker in charge to update markers list locally
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let result = [data[0][1]];
  switch (data[0][1]) {
    case "add":
      result = addMarkerToList(data[0][2], data[1], data[2]);
      break;
    case "update":
      result = updateMarkerFromList(data[0][2], data[1]);
      break;
    case "delete":
      result = delteMarkerFromList(data[0][2], data[1])
      break;
  }
  postMessage(result);
});

function addMarkerToList(marker, markersList, species) {
  for (let index = 0; index < species.length; index++) {
    if(species[index].specie_id == marker.specie_id) {
      marker.scientific_name = species[index].scientific_name;
      marker.colloquial_name = species[index].colloquial_name;
      markersList.push(marker);
      return markersList;
    }
  }
  return false;
}

function updateMarkerFromList(marker, markersList) {
  for (let index = 0; index < markersList.length; index++) {
    if(markersList[index].marker_id == marker.marker_id) {
      markersList[index] = marker;
      return markersList;
    }
  }
  return false;
}

function delteMarkerFromList(marker_id: string, markersList) {
  let marker_id_cast = Number.parseInt(marker_id);
  for (let index = 0; index < markersList.length; index++) {
    if(markersList[index].marker_id == marker_id_cast) {
      // Very important: array.splice method doesn't modifies the length correctly. We must delete the value firstly and then the empty indexes to trigger a change event.
      delete markersList[index];
      markersList = markersList.filter(Boolean)
      return markersList;
    }
  }
  return false;
}