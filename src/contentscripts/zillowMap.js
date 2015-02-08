function modifyZillowMap() {
  var longitude1 = null;
  var latitude1 = null;
  var longitude2 = null;
  var latitude2 = null;
  var state = null;

  var lastUrl = "";
  var lastHomePrice = 0;
  
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

  function monitorHomeInFocusPrice() {
    var homePrice = $(".estimates .main-row span").text();

    if(homePrice && homePrice.length > 0) {
      homePrice = homePrice.replace(/\$|,/g,"");
      homePrice = Math.round(parseFloat(homePrice));

      if(homePrice != lastHomePrice) {
        lastHomePrice = homePrice;

        var adviceElement = $("#adviceForHome");
        var adviceElementIsNew = false;

        if(adviceElement.length == 0) {
          adviceElement = $("<div id='adviceForHome' />");
          adviceElementIsNew = true;
        }
        else {
          adviceElement.empty();
        }

        adviceElement.append($("<div class='loan-calculator-label' style='color: #00cc22'>Zillow Personal Advisor</div>"));
        adviceElement.append($("<strong class='hlc-output-fixed30'>Advice for home based on your financials:</strong><br />"));
        adviceElement.append($("<br /><span id='personal-advisor-advice-message'><span>Loading advice...  </span><img src='/static/images/zsg/loader-white.gif' /></span><br /><br /><br />"));
        adviceElement.append($("<div class='loan-calculator-label'>Description</div>"));
        
        if(adviceElementIsNew) {
          $("#home-value-wrapper").append(adviceElement);
        }

        recommendationForPrice(homePrice, function(recommendation) {
          var recommendationMessage = "";
          if(recommendation.message) {
            recommendationMessage = recommendation.message;
          }
          else {
            recommendationMessage = "Based on your current liquid assets, we recommend a <strong>" + recommendation.percentage + "%</strong> down payment, which will result in an average <strong>" + recommendation.interestRate.toFixed(2) + "%</strong> interest rate and a <strong>$" + recommendation.monthlyPayment.toFixed(2) + "</strong> monthly payment.";
          }

          adviceElement.find("#personal-advisor-advice-message").empty().text(recommendationMessage);
        });
      }
    }
  }

  setInterval(monitorUrlChange, 100);
  setInterval(monitorHomeInFocusPrice, 100);
}