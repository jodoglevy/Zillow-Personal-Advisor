var activeHousingBaseUrl = "http://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/All_Active-WA-Feb2015/FeatureServer/0/query?"

function loadActiveHousingAgencyFromPoint(latitude, longitude, distance, callback) {
    var geometryString = 'geometry=' + latitude + ',' + longitude + '&';
    geometryString += 'geometryType=esriGeometryPoint&'

    makeAHCACall(geometryString, distance, callback);
}

function loadActiveHousingAgencyFromEnvelope(x_min, x_max, y_min, y_max, distance, callback) {
    var geometryString = 'geometry={';
    geometryString += '"xmin":' + x_min;
    geometryString += ',"ymin":' + y_min;
    geometryString += ',"xmax":' + x_max;
    geometryString += ',"ymax":' + y_max;
    geometryString += ',"spatialReference":{"wkid":4326}}&';
    geometryString += 'geometryType=esriGeometryEnvelope&';

    makeAHCACall(geometryString, distance, callback);
}

function makeAHCACall(geometryString, distance, callback) {
    var url = formatAHCAUrl(activeHousingBaseUrl, geometryString, distance);
    return makeAJAXCall(url, callback);
}

function formatAHCAUrl(url, geometryString, distance) {
    url += geometryString;
    url += 'inSR={"wkid":4326}&';
    url += 'spatialRel=esriSpatialRelIntersects&';
    url += 'distance=' + distance + '&';
    url += 'units=esriSRUnit_StatuteMile&';
    url += 'outSR={"wkid":4326}&';
    url += 'f=pgeojson&';
    url += 'outFields=*';
    return url;
}

function makeAJAXCall(url, callback) {
    $.ajax(url, {
        success: function(data) {
            callback(data);
        },
        error: function() {
            console.log("Peeny Farts");
        }
    });
}
