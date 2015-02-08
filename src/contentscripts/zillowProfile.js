function modifyZillowProfile() {
  var financialDataLink = $("<br /><p><strong>Need advise? </strong><a>Add your finances to Zillow</a> and we'll find the best homes for <strong>you, personally.</strong> Pull your data from <span style='color: #00c96d'><strong>Mint</strong></span> or enter it manually.</p>");

  financialDataLink.click(function() {
    var containerElement = $("#profile-aboutme-editRegion").parent();

    if(!$("#financial-data").length){
      var financialDataSection = $("<div/>", {
        id: 'financial-data',
        style: 'display:none'
      }).appendTo(containerElement);

      setupPullFromMint(financialDataSection);
    
      setupFinancialForm(financialDataSection);
    }
    
    $("#affordabilityDiv").hide();
    $("#financial-data").slideDown();

    
  });

  $("#profile-aboutme-content").append(financialDataLink);
  
}

function setupPullFromMint(financialDataSection) {
  

    if(!$("#mintButton").length) {
      var pullFromMintButton = $("<button/>", {
        id: "mintButton",
        //class: "zsg-button_primary",
        text: "Pull From Mint",
        style: "background-color: #00c96d; color: #fff; border: 1px solid transparent; border-radius: 5px; cursor: pointer; display:inline-block; padding: .4em .67em; white-space: normal; width: auto; line-height: 1.5"
      }).appendTo(financialDataSection);

      $("<p/>").appendTo(financialDataSection);

      pullFromMintButton.click(function() {
        globalStorage.setItem("mintInfo", null);
        globalStorage.setItem("grabFromMint", true);
        window.open("https://wwws.mint.com/overview.event");

        function checkGrabbedMintInfo() {
          setTimeout(function() {
            console.log("In set timeout");
            globalStorage.getItem("mintInfo", function(mintInfo) {
              if(mintInfo) {
                populateFormWithValues(JSON.parse(mintInfo));
                $(".fromMint").css("background", "rgba(0,201,109,0.2)");
              } else {
                checkGrabbedMintInfo();
              }
            });
          }, 100);
        }

        checkGrabbedMintInfo();

        return false;
      });
    }
}

function setupFinancialForm(financialDataSection) {  

    var form = $("<form/>", {
      id: "financial-form",
      class: "zsg-form auth-form profile-edit-form show-consumer"
    }).appendTo(financialDataSection);

    var fieldSet = $("<fieldset></fieldset>").appendTo(form);

    var formList = $("<ul/>", {
      class: "form-field-wrapper"
    }).appendTo(fieldSet);

    addFormField(formList, "monthlyIncome", "Monthly Income", "Enter your average gross monthly income in $US (e.g. 2000)", true);
    addFormField(formList, "averageMonthlyLeftOver", "Monthly Net", "Enter your average net monthly income in $US (e.g. 1000)", true);
    addFormField(formList, "creditScore", "Credit Score", "Enter your credit score", true);
    addFormField(formList, "totalLiquidAssets", "Total Liquid Assets", "Enter your total liquid assets (non-invested assets)", true);

    var selectValues = ["Select Marital Status", "Single", "Married", "Living Together", "No Longer Married"];
    AddDropDownField(formList, "maritalStatus", "Marital Status", selectValues, true);

    addFormField(formList, "monthlyHousingCost", "Monthly Housing Cost", "Enter your current monthly house payment e.g. for rent or existing mortgage", true);

    var yesNoValues = ["Yes", "No"];
    AddDropDownField(formList, "isTeacher", "Are you a teacher?", yesNoValues, true);
    AddDropDownField(formList, "isVeteran", "Are you a veteran?", yesNoValues, false);
    AddDropDownField(formList, "isDisabled", "Are you a disabled?", yesNoValues, false);

    var householdAdults = ["1 Adult", "2 Adults", "3 Adults", "4 Adults", "5 Adults", "6+ Adults"];
    AddNumericDropDownField(formList, "householdSizeAdults", "How many adults in your household?", householdAdults, true);

    var householdChildren = ["0 Children", "1 Child", "2 Children", "3 Children", "4 Children", "5 Children", "6+ Children"];
    AddNumericDropDownField(formList, "householdSizeChildren", "How many children in your household?", householdChildren, true);

    var buttonsDiv = $("<div/>", {
      class: "zsg-g"
    }).appendTo(form);

    var buttonsList = $("<ul/>", {
      class: "zsg-lg-3-4 zsg-sm-1-1 action zsg-button-group"
    }).appendTo(buttonsDiv);

    var submitButtonListElement = $("<li/>").appendTo(buttonsList);
    var cancelButtonListElement = $("<li/>").appendTo(buttonsList);

    var submitButton = $("<button/>", {
      class: "zsg-button_primary",
      text: "Submit",
      type: "submit"
    }).appendTo(submitButtonListElement);

    var cancelButton = $("<button/>", {
      class: "zsg-button",
      text: "Cancel"
    }).appendTo(cancelButtonListElement);

    cancelButton.click(function() {
      $("#financial-form").trigger("reset");
      return false;
    });

    submitButton.click(function() {
      var formData = $("#financial-form").serializeArray();

      var userInfo = {
        "monthlyIncome" : parseInt(formData[0].value),
        "averageMonthlyLeftOver" : parseInt(formData[1].value),
        "creditScore" : parseInt(formData[2].value),
        "totalLiquidAssets" : parseInt(formData[3].value),
        "maritalStatus" : formData[4].value,
        "monthlyHousingCost" : parseInt(formData[5].value),
        "isTeacher" : JSON.parse(formData[6].value),
        "isVeteran" : JSON.parse(formData[7].value),
        "isDisabled" : JSON.parse(formData[8].value),
        "householdSizeAdults" : parseInt(formData[9].value),
        "householdSizeChildren" : parseInt(formData[10].value)
      }
      var userInfoStringified = JSON.stringify(userInfo);

      globalStorage.setItem('userInfo', userInfoStringified);

      financialDataSection.slideUp(400, function() {
        globalStorage.getItem("houseCosts", function(houseCosts) {
          if(houseCosts) {
            setAffordabilityNumbers(JSON.parse(houseCosts));
          }
        });
      });

      return false;
    });

    globalStorage.getItem("userInfo", function(userInfo) {
      if(userInfo) {
        populateFormWithValues(JSON.parse(userInfo));
      }
    });
}

function setAffordabilityNumbers(info) {
  console.log(info);
  var containerElement = $("#profile-aboutme-editRegion").parent();

  if(!$("#affordabilityDiv").length) {
    var affordabilityDiv = $("<div/>", {
      id : "affordabilityDiv",
      style : "display:none"
    });
    var comfortableHouseCost = $("<input id='comfortCost' type='text' style='width:100px'/>");
    affordabilityDiv.append(comfortableHouseCost);
    affordabilityDiv.append("<p>Comfortable House Cost</p>");
    var comfortableHouseSlider = $("<div/>", {
      id : "comfortableHouseSlider"
    });
    affordabilityDiv.append(comfortableHouseSlider);

    affordabilityDiv.append("<p/>");
    affordabilityDiv.append("<p/>");

    var maxHouseCost = $("<input id='maxCost' type='text' style='width:100px'/>");
    affordabilityDiv.append(maxHouseCost);
    affordabilityDiv.append("<p>Max House Cost</p>");

    var maxHouseSlider = $("<div/>", {
      id : "maxHouseSlider"
    });
    affordabilityDiv.append(maxHouseSlider);

    containerElement.append(affordabilityDiv);

    comfortableHouseSlider.slider({
      value: parseInt(info.comfortableHouseCost),
      min: 0,
      max: 1000000,
      step: 10000,
      slide: function( event, ui ) {
        comfortableHouseCost.val("$" + ui.value );
      }
    });
    comfortableHouseCost.val("$" + comfortableHouseSlider.slider("value"));

    maxHouseSlider.slider({
      value: parseInt(info.maxHouseCost),
      min: 0,
      max: 1000000,
      step: 10000,
      slide: function( event, ui ) {
        maxHouseCost.val("$" + ui.value );
      }
    });
    maxHouseCost.val("$" + maxHouseSlider.slider("value"));
  } else {
    $("#comfortCost").text("Comfortable House Cost: " + info.comfortableHouseCost);
    $("#maxCost").text("Comfortable House Cost: " + info.maxHouseCost);
  }
  
  $("#affordabilityDiv").slideDown(700);
}

function populateFormWithValues(info) {
  console.log(info);
  $("#monthlyIncome").val(info.monthlyIncome);
  $("#averageMonthlyLeftOver").val(info.averageMonthlyLeftOver);
  $("#creditScore").val(info.creditScore);
  $("#totalLiquidAssets").val(info.totalLiquidAssets);
  $("#maritalStatus").val(info.maritalStatus);
  $("#monthlyHousingCost").val(info.monthlyHousingCost);
  if(typeof info.profession !== 'undefined') {
    if(info.profession === "Education") {
      $("#isTeacher").val("true");
    } else {
      $("#isTeacher").val("false");
    }
  }
  if(typeof info.isTeacher !== 'undefined') {
    $("#isTeacher").val(info.isTeacher.toString());
  }
  if(typeof info.isVeteran !== 'undefined') {
    $("#isVeteran").val(info.isVeteran.toString());
  }
  if(typeof info.isDisabled !== 'undefined'){
    $("#isDisabled").val(info.isDisabled.toString());
  }
  $("#householdSizeAdults").val(info.householdSizeAdults);
  $("#householdSizeChildren").val(info.householdSizeChildren);
}

function addRadioButtonField(formList, name, label) {
  var formListElement = $("<li/>", {
    class: "zsg-form-field zsg-g"
  }).appendTo(formList);

  var labelListElementDiv = $("<div/>", {
    class: "label zsg-lg-1-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var labelTag = $("<label/>", {
    text: label
  }).appendTo(labelListElementDiv);

  labelTag.css("font-weight", "Bold");

  var fieldListElementDiv = $("<div/>", {
    class: "field zsg-lg-3-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  //var radioButtonList = $("<ul/>", {
  //  class: "zsg-form-group zsg-list_inline user-subscriptions-form-group",
  //}).appendTo(fieldListElementDiv);


  //var yesRadioButtonListItem = $("<li/>").append(radioButtonList);
  //var noRadioButtonListItem = $("<li/>").append(radioButtonList);

  var yesRadioButton = $("<input/>", {
    type: "radio",
    name: name,
    value: true
  }).appendTo(fieldListElementDiv);

  var yesButtonLabel = $("<label/>", {
    text: "Yes",
  }).appendTo(fieldListElementDiv);

  var noRadioButton = $("<input/>", {
    type: "radio",
    name: name,
    checked: "checked",
    value: false
  }).appendTo(fieldListElementDiv);

  var noButtonLabel = $("<label/>", {
    text: "No"
  }).appendTo(fieldListElementDiv);
}

function addFormField(formList, name, label, placeholder, canComeFromMint) {
  var formListElement = $("<li/>", {
    class: "zsg-form-field zsg-g"
  }).appendTo(formList);

  var labelListElementDiv = $("<div/>", {
    class: "label zsg-lg-1-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var labelTag = $("<label/>", {
    text: label
  }).appendTo(labelListElementDiv);

  labelTag.css("font-weight", "Bold");

  var fieldListElementDiv = $("<div/>", {
    class: "field zsg-lg-3-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var field = $("<input/>", {
    class: "numbersOnly",
    type: "text",
    id: name,
    name: name,
    placeholder: placeholder,
    maxLength: "10"
  }).appendTo(fieldListElementDiv);

  if(canComeFromMint) {
    field.addClass("fromMint");
  }

  field.keyup(function() {
    this.value = this.value.replace(/[^0-9\.]/g,'');
  });
}

function AddDropDownField(formList, name, label, selectValues, canComeFromMint) {
  var formListElement = $("<li/>", {
    class: "zsg-form-field zsg-g"
  }).appendTo(formList);

  var labelListElementDiv = $("<div/>", {
    class: "label zsg-lg-1-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var labelTag = $("<label/>", {
    text: label
  }).appendTo(labelListElementDiv);

  labelTag.css("font-weight", "Bold");

  var fieldListElementDiv = $("<div/>", {
    class: "field zsg-lg-3-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var field = $("<select/>", {
    class: canComeFromMint ? "fromMint" : "",
    name: name,
    id: name
  }).appendTo(fieldListElementDiv);

  $.each(selectValues, function(key, value) {
    if(value === "Yes") {
      field.append($("<option></option>")
        .attr("value","true")
        .text(value)); 
    } else if(value === "No") {
      field.append($("<option></option>")
        .attr("value","false")
        .text(value)); 
    } else {
      field.append($("<option></option>")
        .attr("value",value)
        .text(value)); 
    }
  });
}

function AddNumericDropDownField(formList, name, label, selectValues, canComeFromMint) {
  var formListElement = $("<li/>", {
    class: "zsg-form-field zsg-g"
  }).appendTo(formList);

  var labelListElementDiv = $("<div/>", {
    class: "label zsg-lg-1-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var labelTag = $("<label/>", {
    text: label
  }).appendTo(labelListElementDiv);

  labelTag.css("font-weight", "Bold");

  var fieldListElementDiv = $("<div/>", {
    class: "field zsg-lg-3-4 zsg-sm-1-1"
  }).appendTo(formListElement);

  var field = $("<select/>", {
    class: canComeFromMint ? "fromMint" : "",
    name: name,
    id: name
  }).appendTo(fieldListElementDiv);

  $.each(selectValues, function(key, value) {   
    field.append($("<option></option>")
      .attr("value",parseInt(value))
      .text(value)); 
  });
}