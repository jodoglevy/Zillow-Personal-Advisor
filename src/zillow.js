function startZillow() {
    
  setInterval(function() {
    chrome.runtime.sendMessage({"shouldReload": true}, function(shouldReload) {
      if(shouldReload) {
        window.location.reload();
      }
    });
  }, 100);

  setTimeout(function() {
    globalStorage.getItem("mintInfo", function(value) {
	console.log("Value: " + value);

	var parsedJSON = JSON.parse(value);
	var monthlyIncome = parsedJSON.monthlyIncome;
	var creditScore = parsedJSON.creditScore;
	var totalLiquidAssets = parsedJSON.totalLiquidAssets;
	var martialStatus = parsedJSON.martialStatus;
	var monthlyHousingCost = parsedJSON.monthlyHousingCost;
	var averageMonthlyLeftOver = parsedJSON.averageMonthlyLeftOver;
	
	var interestRate = .04; // Need to calculate this but currently hard code to 4%
	var mortgagePeriod = 360; // Assume 30 year fixed
	var c = interestRate/12;

	console.log("c: " + c);
	
	var currentHouseCostLoanAmount = monthlyHousingCost * (Math.pow((1+c), mortgagePeriod) - 1) / (c * Math.pow((1+c), mortgagePeriod));
	var maxLoanAmount = (monthlyHousingCost+averageMonthlyLeftOver) * (Math.pow((1+c), mortgagePeriod) - 1) / (c * Math.pow((1+c), mortgagePeriod));

	console.log("Loan Amount based on current monthlyHousingCost: " + currentHouseCostLoanAmount);
	console.log("Loan Amount based on current monthlyHousingCost and avg monthly leftOver: " + maxLoanAmount);
	
	var availableForDown = totalLiquidAssets*.9;
	var comfortableHouseCost = currentHouseCostLoanAmount + availableForDown;
	var maxHouseCost = maxLoanAmount + availableForDown;

	console.log("Comfortable House cost: " + comfortableHouseCost);
	console.log("Max House cost: " + maxHouseCost);

	getInterestRate();
    });
  }, 1000);
}

function getInterestRate() {
	var cookie = document.cookie;
	var guidCookie = getCookie("zguid");
	var decodeGuid = decodeURIComponent(guidCookie);
	var splitDecodeGuid = decodeGuid.split("|");
	var guidArray = splitDecodeGuid[1];
	var parsedGUIDArray = JSON.parse(guidArray);
	console.log("guid: " + parsedGUIDArray[0]);

	var guid = parsedGUIDArray[0];
	var submitRequestUrl = 'https://mortgageapi.zillow.com/submitRequest?property.type=SingleFamilyHome&property.use=Primary&property.zipCode=98112&property.value=1315450&borrower.creditScoreRange=R_760_&borrower.annualIncome=70000&purchase.downPayment=263090&submittedForFeaturedLenders=true&desiredPrograms.0=Fixed30Year&partnerId=RD-FVBXMBZ&userSessionId=c57a4db8-2624-47ce-8471-f4937b89d535'
	var submitRequestResponse = httpGet(submitRequestUrl);
	var parsedSubmitRequestResponse = JSON.parse(submitRequestResponse);
	var requestId = parsedSubmitRequestResponse.requestId;
	console.log("Response: " + submitRequestResponse);
	console.log("RequestId: " + requestId);

	setTimeout(function(){
    		var getQuotesUrl = 'https://mortgageapi.zillow.com/getQuotes?partnerId=RD-FVBXMBZ&requestRef.id=' + requestId;
		var getQuotesResponse = httpGet(getQuotesUrl);
		console.log("GetQuotes Response: " + getQuotesResponse);
		var parsedGetQuotesResponse = JSON.parse(getQuotesResponse);
		var quotes = parsedGetQuotesResponse.quotes;
		console.log("Quotes: " + quotes);
		for (quote in quotes) {
			console.log("APR: " + quote.apr);
		}
	}, 2000);
}

// From W3 schools
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// From Stack Overflow
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
