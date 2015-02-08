function startZillow() {
    
  setInterval(function() {
    chrome.runtime.sendMessage({"shouldReload": true}, function(shouldReload) {
      if(shouldReload) {
        window.location.reload();
      }
    });
  }, 100);

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
	var comfortableHouseCost = Math.round(currentHouseCostLoanAmount + availableForDown);
	var maxHouseCost = Math.round(maxLoanAmount + availableForDown);

	console.log("Comfortable House cost: " + comfortableHouseCost);
	console.log("Max House cost: " + maxHouseCost);

	var interestRate = getInterestRate(comfortableHouseCost, function(interestRate) {
			console.log("interestRate: " + interestRate);
	});
    });
}

function doIqualify(state) {
	globalStorage.getItem("userInfo", function(value) {
		switch(state) {
			case "WA":
			case "Washington":
			case "washington":
				return doIQualifyInWashington(value);
				break;
			default:
				break;
		}
	});
}

function doIqualifyInWashington(value) {
	var parsedJSON = JSON.parse(value);
	var isVeteran = parsedJSON.isVeteran;
	var isTeacher = parsedJSON.isTeacher;
	var isDisabled = parsedJSON.isDisabled;
	var householdSizeAdults = parsedJSON.householdSizeAdults;
	var householdSizeChildren = parsedJSON.householdSizeChildren;
	var totalInHousehold = householdSizeAdults+householdSizeChildren;
	var monthlyIncome = parsedJSON.monthlyIncome;
	var totalIncome = monthlyIncome * 12;

	if (totalIncome < 97000)
		return true;
	if (isVeteran && totalIncome < 88000)
		return true;
	if (isTeacher && totalIncome < 88000)
		return true;
	if (isDisabled && totalIncome < 88000)
		return true;
	if (totalInHousehold == 1 && totalIncome < 44000)
		return true;
	if (totalInHousehold == 2 && totalIncome < 51000)
		return true;
	if (totalInHousehold == 3 && totalIncome < 57000)
		return true;
	if (totalInHousehold == 4 && totalIncome < 63000)
		return true;
	if (totalInHousehold == 5 && totalIncome < 69000)
		return true;
	if (totalInHousehold == 6 && totalIncome < 74000)
		return true;
	if (totalInHousehold == 7 && totalIncome < 79000)
		return true;
	if (totalInHousehold == 8 && totalIncome < 84000)
		return true;
return false;
}

function getInterestRate(comfortableHouseCost, callback) {
	var cookie = document.cookie;
	var guidCookie = getCookie("zguid");
	var decodeGuid = decodeURIComponent(guidCookie);
	var splitDecodeGuid = decodeGuid.split("|");
	var guidArray = splitDecodeGuid[1];
	var parsedGUIDArray = JSON.parse(guidArray);
	console.log("guid: " + parsedGUIDArray[0]);

	var guid = parsedGUIDArray[0];
	var submitRequestUrl = 'https://mortgageapi.zillow.com/submitRequest?' +
		'property.type=SingleFamilyHome&' +
		'property.use=Primary&' +
		'property.zipCode=98112&' +
		'property.value=' + comfortableHouseCost + '&'+
		'borrower.creditScoreRange=R_760_&' +
		'borrower.annualIncome=70000&' +
		'purchase.downPayment=20090&' +
		'submittedForFeaturedLenders=true&' +
		'desiredPrograms.0=Fixed30Year&' +
		'partnerId=RD-FVBXMBZ&' +
		'userSessionId=' + guid
	
	console.log("SubmitRequestUrl: " + submitRequestUrl);
	$.ajax({
  		url: submitRequestUrl
	}).done(function(submitRequestResponse) {
		//var submitRequestResponse = httpGet(submitRequestUrl);
		var requestId = submitRequestResponse.requestId;
		console.log("Response: " + submitRequestResponse);
		console.log("RequestId: " + requestId);
		var getQuotesUrl = 'https://mortgageapi.zillow.com/getQuotes?partnerId=RD-FVBXMBZ&requestRef.id=' + requestId;
		
		$.ajax({
  			url: getQuotesUrl
		}).done(function(getQuotesResponse) {
			console.log("GetQuotes Response: " + getQuotesResponse);
			for (var key in getQuotesResponse) {
	      			console.log(key,":",getQuotesResponse[key]);
	  		}
	
			var quotes = getQuotesResponse["quotes"];
			var count = 0;
			var totalapr = 0;
			for (quote in quotes) {
				var curQuote = quotes[quote];
				var apr = JSON.stringify(curQuote["apr"]);
				console.log("APR: " + apr);
				totalapr += parseInt(apr);
				count++;
			}
		
			if (count != 0) {
				var avgapr = totalapr/count;
				console.log("average apr: " + avgapr);
				callback(avgapr);
			} else {
				callback(null);
			}
		});
	});

	
}

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

