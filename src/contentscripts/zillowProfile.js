function modifyZillowProfile() {
  var financialDataLink = $("<p><a>Add more detailed financial data to your profile.</a> You can enter your own info here or pull data from Mint.</p>");

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
        class: "zsg-button_primary",
        text: "Pull Data From Mint"
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

    addFormField(formList, "monthlyIncome", "Monthly Income", "Enter your monthly income in $US (e.g. 2000)");
    addFormField(formList, "averageMonthlyLeftOver", "Monthly Net", "Enter your current monthly leftover money");
    addFormField(formList, "creditScore", "Credit Score", "Enter your credit score");
    addFormField(formList, "totalLiquidAssets", "Total Liquid Assets", "Enter your total liquid assets");

    var selectValues = ["Select Marital Status", "Single", "Married", "Living Together", "No Longer Married"];
    AddDropDownField(formList, "maritalStatus", "Marital Status", selectValues);

    addFormField(formList, "monthlyHousingCost", "Monthly Housing Cost", "Enter your current monthly house payment");

    var yesNoValues = ["Yes", "No"];
    AddDropDownField(formList, "isTeacher", "Are you a teacher?", yesNoValues);
    AddDropDownField(formList, "isVeteran", "Are you a veteran?", yesNoValues);
    AddDropDownField(formList, "isDisabled", "Are you a disabled?", yesNoValues);

    var householdAdults = ["1 Adult", "2 Adults", "3 Adults", "4 Adults", "5 Adults", "6+ Adults"];
    AddNumericDropDownField(formList, "householdSizeAdults", "How many household adults?", householdAdults);

    var householdChildren = ["0 Children", "1 Child", "2 Children", "3 Children", "4 Children", "5 Children", "6+ Children"];
    AddNumericDropDownField(formList, "householdSizeChildren", "How many household children?", householdChildren);

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
    var comfortableHouseCost = $("<p id='comfortCost'>Comfortable House Cost: " + info.comfortableHouseCost + "</p>");
    var maxHouseCost = $("<p id='maxCost'>Max House Cost: " + info.maxHouseCost + "</p>");

    affordabilityDiv.append(comfortableHouseCost);
    affordabilityDiv.append(maxHouseCost);

    containerElement.append(affordabilityDiv);
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

function addFormField(formList, name, label, placeholder) {
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

  field.keyup(function() {
    this.value = this.value.replace(/[^0-9\.]/g,'');
  });
}

function AddDropDownField(formList, name, label, selectValues) {
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

function AddNumericDropDownField(formList, name, label, selectValues) {
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
    name: name,
    id: name
  }).appendTo(fieldListElementDiv);

  $.each(selectValues, function(key, value) {   
    field.append($("<option></option>")
      .attr("value",parseInt(value))
      .text(value)); 
  });
}