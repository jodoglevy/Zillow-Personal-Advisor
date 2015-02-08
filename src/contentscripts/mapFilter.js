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
       .text("Personal Affordability Advice").css("color", "#00CC22");

   var mapFilterPane = $("<div/>", {
       class: "filter-pane",
       id: "map-filter-pane",
       style: "width: 300px"
   }).appendTo(mapFilterMenu);

   var mapFilterUL = $("<ul/>", {
       id: "map-filter-options",
       style: "margin: 10px",
       class: "zf-dropdown-options zsg-menu-linklist"
   }).appendTo(mapFilterPane);

   var mapListItem = $("<li/>").appendTo(mapFilterUL);
   var itemDiv = $("<div/>").appendTo(mapListItem);
   var filterDropdown = $("<select id='filterDropdown'><option value='none'>None</option><option value='remove'>Remove unafforable houses</option><option value='replace'>Classify houses by affordability</option></select>").appendTo(itemDiv);
   filterDropdown.change(function() {
    globalStorage.setItem("filterManipulationAction", JSON.stringify($(this).val()));
    reloadMap();
   });

   globalStorage.getItem("filterManipulationAction", function(filterManipulationAction) {
    if(filterManipulationAction !== 'undefined') {
      filterDropdown.val(JSON.parse(filterManipulationAction));
    }
    filterDropdown.change();
   });

}
