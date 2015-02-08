function modifyZillowProfile() {
  var financialDataLink = $("<p><a>Add more detailed financial data to your profile.</a> You can enter your own info here or pull data from Mint.</p>");

  financialDataLink.click(function() {
    var containerElement = $("#profile-aboutme-editRegion").parent();

    if(!$("#mintButton").length) {
      var pullFromMintButton = $("<button/>", {
        id: "mintButton",
        class: "zsg-button_primary",
        text: "Pull Data From Mint"
      }).appendTo(containerElement);

      $("<p/>").appendTo(containerElement);

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
      });
    }
    
    
    $("<div/>", {
      id: 'financial-data'
    }).appendTo(containerElement);

    var form = $("<form/>", {
      id: "financial-form",
      class: "zsg-form auth-form profile-edit-form show-consumer",
      style: "display:none"
    }).appendTo("#financial-data");

    var fieldSet = $("<fieldset></fieldset>").appendTo(form);

    var formList = $("<ul/>", {
      class: "form-field-wrapper"
    }).appendTo(fieldSet);

    addFormField(formList, "monthlyIncome", "Monthly Income", "Enter your monthly income in $US (e.g. 2000)");
    addFormField(formList, "creditScore", "Credit Score", "Enter your credit score");
    addFormField(formList, "totalLiquidAssets", "Total Liquid Assets", "Enter your total liquid assets");

    var selectValues = ["Select Marital Status", "Single", "Married", "Living Together", "No Longer Married"];
    AddDropDownField(formList, "maritalStatus", "Marital Status", selectValues);

    addFormField(formList, "monthlyHousingCost", "Monthly Housing Cost", "Enter your current monthly house payment");
    addFormField(formList, "averageMonthlyLeftOver", "Monthly Leftover Assets", "Enter your current monthly leftover money");

    var yesNoValues = ["Yes", "No"];
    AddDropDownField(formList, "teacher", "Are you a teacher?", yesNoValues);
    AddDropDownField(formList, "veteran", "Are you a veteran?", yesNoValues);
    AddDropDownField(formList, "disabled", "Are you a disabled?", yesNoValues);

    var householdAdults = ["1 Adult", "2 Adults", "3 Adults", "4 Adults", "5 Adults", "6+ Adults"];
    AddDropDownField(formList, "householdSizeAdults", "How many household adults?", householdAdults);

    var householdChildren = ["0 Children", "1 Child", "2 Children", "3 Children", "4 Children", "5 Children", "6+ Children"];
    AddDropDownField(formList, "householdSizeChildren", "How many household children?", householdChildren);
    //addRadioButtonField(formList, "teacher", "Are you a teacher?");
    //addRadioButtonField(formList, "veteran", "Are you a veteran?");
    //addRadioButtonField(formList, "disabled", "Are you disabled?");

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
      var isTeacher = (formData[6].value === "Yes") ? true : false;
      var isVeteran = (formData[7].value === "Yes") ? true : false;
      var isDisabled = (formData[8].value === "Yes") ? true : false;

      var userInfo = {
        "monthlyIncome" : parseInt(formData[0].value),
        "creditScore" : parseInt(formData[1].value),
        "totalLiquidAssets" : parseInt(formData[2].value),
        "maritalStatus" : formData[3].value,
        "monthlyHousingCost" : parseInt(formData[4].value),
        "averageMonthlyLeftOver" : parseInt(formData[5].value),
        "isTeacher" : isTeacher,
        "isVeteran" : isVeteran,
        "isDisabled" : isDisabled,
        "householdSizeAdults" : parseInt(formData[9].value),
        "householdSizeChildren" : parseInt(formData[10].value)
      }
      var userInfoStringified = JSON.stringify(userInfo);

      globalStorage.setItem('userInfo', userInfoStringified);

      $("#financial-form").slideUp();
      return false;
    });

    $("#financial-form").slideDown();
  });

  $("#profile-aboutme-content").append(financialDataLink);
  
}

function populateFormWithValues(info) {
  console.log(info);
  $("#totalLiquidAssets").val(info.totalLiquidAssets);
  $("#maritalStatus").val(info.maritalStatus);
  $("#creditScore").val(info.creditScore);
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
    name: name
  }).appendTo(fieldListElementDiv);

  $.each(selectValues, function(key, value) {   
    field.append($("<option></option>")
      .attr("value",value)
      .text(value)); 
  });
}