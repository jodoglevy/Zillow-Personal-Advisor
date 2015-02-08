function rewriteZillowGetResultsResponse(data, callback) {
  var manipulationAction = "remove"; // default

  var houseCosts = localStorage.getItem("houseCosts");
  var filterManipulationAction = localStorage.getItem("filterManipulationAction");
  if(filterManipulationAction !== 'undefined'){
    manipulationAction = JSON.parse(filterManipulationAction);
  }
  console.log("Manipulation Action: " + manipulationAction);
    if(houseCosts) {
      var houseCostsParsed = JSON.parse(houseCosts);
      var comfortableHouseCost = houseCostsParsed.comfortableHouseCost/1000;
      var maxHouseCost = houseCostsParsed.maxHouseCost/1000;
      var newHousesArray = [];

      data.map.properties.forEach(function(house) {
        var housePriceAsString = house[3];
        var housePrice = null;
        
        housePriceAsString = housePriceAsString.replace(/\$/g, '');

        // if its above a million it will be displayed as $2.5M, so look for that
        if(housePriceAsString.indexOf("M") !== -1) {
          housePrice = parseFloat(housePriceAsString);
          housePrice = housePrice * 1000;
        }
        else {
          housePrice = parseInt(housePriceAsString);
        }

        switch(manipulationAction) {
          case "none" : break;
          case "replace" :
            if(housePrice > maxHouseCost) {
              house[3] = "Too much";
              house[4] = 1;
            } else if(housePrice > comfortableHouseCost) {
              house[3] = "Stretch " + house[3];
              house[4] = 3;
            }
            else {
              house[4] = 2;
              house[5] = 2;
            }
            break;
          case "remove" :
            if(housePrice < maxHouseCost) {
              newHousesArray.push(house);
            }
        }
      });

      if(manipulationAction === "remove"){
        data.map.properties = newHousesArray;
      }
    }

  

  callback(data);
}