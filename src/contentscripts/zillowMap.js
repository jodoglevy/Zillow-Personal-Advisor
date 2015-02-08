function modifyZillowMap() {
  var longitude1 = null;
  var latitude1 = null;
  var longitude2 = null;
  var latitude2 = null;
  var state = null;

  var lastUrl = "";
  
  function monitorUrlChange() {
    // url changes when the long / lat region changes, so monitor url to know when
    // region being looked at changes

    if(window.location.pathname != lastUrl) {
      lastUrl = window.location.pathname;

      // find lat lng region
      var urlParts = lastUrl.split(/_rect/g)[0].split(/\//g);
      var latLongString = urlParts[urlParts.length - 1];
      var latLongParts = latLongString.split(/,/g);

      latitude1 = latLongParts[0];
      longitude1 = latLongParts[1];
      latitude2 = latLongParts[2];
      longitude2 = latLongParts[3];

      // find state from search term
      urlParts = lastUrl.split(/_rid/g)[0].split(/\//g);
      var searchTerm = urlParts[urlParts.length - 2];
      urlParts = searchTerm.split(/-/g);
      var state = urlParts[urlParts.length - 1];

      if(!latitude1 || latitude1 == "") {
        reloadMap();
      }
      else {
        console.log(state);
        console.log(longitude1);
        console.log(latitude1);
        console.log(longitude2);
        console.log(latitude2);
      }
    }
  }

  setInterval(monitorUrlChange, 100);
}