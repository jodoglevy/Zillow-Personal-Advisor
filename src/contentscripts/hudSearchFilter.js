function appendHUDFilter(searchFilters) {
   var hudMenu = $("<fieldset/>", {
       class: "filter-menu hud-menu",
       id: "hud-menu"
   }).appendTo(searchFilters);

   var hudLegend = $("<legend/>", {
       "data-za-label": "HUD"
   }).appendTo(hudMenu);

   var copiedLabel = $("#beds-menu-label").clone();
   copiedLabel.attr("id", "hud-label");
   copiedLabel.appendTo(hudLegend);
   copiedLabel.find("div").attr("id", "hud-label-div")
       .text("HUD Assistance").css("color", "#00CC22");

   var hudFilterPane = $("<div/>", {
       class: "filter-pane",
       id: "hud-filter-pane",
   }).appendTo(hudMenu);

   var hudUL = $("<ul/>", {
       id: "hud-options",
       style: "margin: 10px",
       class: "zf-dropdown-options zsg-menu-linklist"
   }).appendTo(hudFilterPane);

   var hudListItem = $("<li/>").appendTo(hudUL);
   var itemDiv = $("<div/>").appendTo(hudListItem);
   itemDiv.text("Based on your income, you have qualified for HUD assistance!");
}
