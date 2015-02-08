function rewriteZillowGetResultsResponse(data, callback) {
  var manipulationAction = "replace"; // "none", replace", "remove"
  var affordabilityPreference = 0.15; // Slider controls percentage

  data.map.properties.forEach(function(house) {
    var housePriceAsString = house[3];
    var housePrice = null;
    var priceLimit = 500 * (1 + affordabilityPreference);
    
    housePriceAsString = housePriceAsString.replace(/\$/g, '');

    // if its above a million it will be displayed as $2.5M, so look for that
    if(housePriceAsString.indexOf("M") !== -1) {
      housePrice = parseInt(housePriceAsString);
      housePrice = housePrice * 1000;
    }
    else {
      housePrice = parseInt(housePriceAsString);
    }

    switch(manipulationAction) {
      case "none" : break;
      case "replace" :
        if(housePrice > priceLimit) {
          house[3] = "Too much";
        }
        else {
          house[3] = "Affordable";
        }
        break;
      case "remove" :
        if(housePrice > priceLimit) {
          house.shouldDelete = true;
        }
    }
  });

  callback(data);
}