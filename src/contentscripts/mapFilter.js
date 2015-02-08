function appendMapFilter(searchFilters) {
   var mapFilterMenu = $("<fieldset/>", {
       class: "filter-menu",
       id: "map-filter-menu"
   }).appendTo(searchFilters);

   var mapLegend = $("<legend/>", {
       "data-za-label": "HUD"
   }).appendTo(mapFilterMenu);

   var copiedLabel = $("#beds-menu-label").clone();
   copiedLabel.attr("id", "map-filter-menu");
   copiedLabel.appendTo(mapLegend);
   copiedLabel.find("div").attr("id", "map-label-div")
       .text("Affordability Filter").css("color", "#00CC22");

   var mapFilterPane = $("<div/>", {
       class: "filter-pane",
       id: "map-filter-pane",
   }).appendTo(mapFilterMenu);

   var mapFilterUL = $("<ul/>", {
       id: "map-filter-options",
       style: "margin: 10px",
       class: "zf-dropdown-options zsg-menu-linklist"
   }).appendTo(mapFilterPane);

   var mapListItem = $("<li/>").appendTo(mapFilterUL);
   var itemDiv = $("<div/>").appendTo(mapListItem);
   var filterDropdown = $("<select id='filterDropdown'><option value='remove'>Remove houses</option><option value='replace'>Modify houses</option></select>").appendTo(itemDiv);
   filterDropdown.change(function() {
    globalStorage.setItem("filterManipulationAction", JSON.stringify($(this).val()));
    reloadMap();
   });
   filterDropdown.change();
}
