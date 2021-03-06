function appendAdviceFilter(searchFilters, qualifyMessage) {
   var adviceMenu = $("<fieldset/>", {
       class: "filter-menu advice-menu",
       id: "advice-menu"
   }).appendTo(searchFilters);

   var adviceLegend = $("<legend/>", {
       "data-za-label": "Advice"
   }).appendTo(adviceMenu);

   var copiedLabel = $("#beds-menu-label").clone();
   copiedLabel.attr("id", "advice-label");
   copiedLabel.appendTo(adviceLegend);
   copiedLabel.find("div").attr("id", "advice-label-div")
       .text("HUD Advice").css("color", "#00CC22");

   var adviceFilterPane = $("<div/>", {
       class: "filter-pane",
       id: "advice-filter-pane",
       style: "width: 400px"
   });//.appendTo(copiedLabel);

   copiedLabel.click(function() {
       adviceFilterPane.dialog({
           width : 800,
           maxHeight : 300,
           title: "Active Housing Counseling Agencies",

       });
       var xmin, ymin, xmax, ymax;
       var coordinates = JSON.parse(localStorage.getItem("coords"));
       if (coordinates) {
          xmin = coordinates.x_min;
          xmax = coordinates.x_max;
          ymin = coordinates.y_min;
          ymax = coordinates.y_max;
       } else {
           xmin = -122.309;
           xmax = -122.303;
           ymin = 47.625;
           ymax = 47.629;
       }
       if (qualifyMessage) {
       loadActiveHousingAgencyFromEnvelope(xmin, xmax, ymin, ymax, 50,
               function success(data) {
                   var dataJSON = JSON.parse(data);
                   var tableDesc = $("<li/>", {id: "tableDesc"}).appendTo($("#advice-ul"));
                   var descText = $("<div/>").appendTo(tableDesc);
                   descText.text("There are " + dataJSON.features.length + " advisors nearby:");
                   var advisorTableLI = $("<li/>", {id: "advisorLI"}).appendTo($("#advice-ul"));
                   var advisorTable = $("<table/>", {id: "advisorTable", style: "color: black; font-size: 11.5px"}).appendTo($("#advisorLI"));

                   dataJSON.features.forEach(function(item) {
                       var tableRow = $("<tr/>").appendTo($("#advisorTable"));
                       var agencyName = $("<td/>").appendTo(tableRow);

                       var agencyLink = $("<a/>", {
                           href: item.properties.Agency_Website,
                           target: "_blank",
                           style: "outline-style: none",
                       }).appendTo(agencyName);
                       agencyLink.text(item.properties.Agency_Name);
                       var agencyAddress = $("<td/>").appendTo(tableRow);
                       agencyAddress.text(item.properties.Agency_Address_1 + ", "
                           + item.properties.Agency_Address_City + ", "
                           + item.properties.Agency_Address_State + " "
                           + item.properties.Agency_Address_Zip);
                   });
        });
       }
   });


   var adviceEntries = $("<div/>", {
       class: "search-entry category-entries zsg-content-item"
   }).appendTo(adviceFilterPane);

   var adviceUL = $("<ul/>", {
       class: "home-icons",
       id: "advice-ul"
   }).appendTo(adviceEntries);

   var adviceListItem = $("<li/>").appendTo(adviceUL);
   var itemDiv = $("<div/>").appendTo(adviceListItem);
   itemDiv.attr("style", "white-space: normal; color: #000000");
   if (qualifyMessage) {
       var messageJSON = JSON.parse(qualifyMessage);

       var hudInfo = $("<div/>").appendTo(itemDiv);
       hudInfo.text(messageJSON.message);

       var tooltipButton = $("<a/>", {
           href: messageJSON.url,
           target: "_blank",
           style: "outline-style: none",
           class: "zsg-icon-circle-question"
       }).appendTo(hudInfo);
   } else {
       var hudInfo = $("<div/>").appendTo(itemDiv);
       hudInfo.text("Sorry, you do not qualify for federal assistance.");
   }
}

