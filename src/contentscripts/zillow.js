function startZillow() {
    
  setInterval(function() {
    chrome.runtime.sendMessage({"shouldReload": true}, function(shouldReload) {
      if(shouldReload) {
        window.location.reload();
      }
    });
  }, 100);

    globalStorage.getItem("userInfo", function(value) {
//	console.log("Value: " + value);

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

//	console.log("c: " + c);
	
	var currentHouseCostLoanAmount = monthlyHousingCost * (Math.pow((1+c), mortgagePeriod) - 1) / (c * Math.pow((1+c), mortgagePeriod));
	var maxLoanAmount = (monthlyHousingCost+averageMonthlyLeftOver) * (Math.pow((1+c), mortgagePeriod) - 1) / (c * Math.pow((1+c), mortgagePeriod));

//	console.log("Loan Amount based on current monthlyHousingCost: " + currentHouseCostLoanAmount);
//	console.log("Loan Amount based on current monthlyHousingCost and avg monthly leftOver: " + maxLoanAmount);
	
	var availableForDown = totalLiquidAssets*.9;
	var comfortableHouseCost = Math.round(currentHouseCostLoanAmount + availableForDown);
	var maxHouseCost = Math.round(maxLoanAmount + availableForDown);

	var houseCostObjects = {
		"maxHouseCost" : maxHouseCost,
		"comfortableHouseCost" : comfortableHouseCost
	};

	globalStorage.setItem("houseCosts", JSON.stringify(houseCostObjects));

//	console.log("Comfortable House cost: " + comfortableHouseCost);
//	console.log("Max House cost: " + maxHouseCost);

//	var interestRate = getInterestRate(comfortableHouseCost, function(interestRate) {
//			console.log("interestRate: " + interestRate);
//	});
	
	var doIQualify = doIqualify("WA", function(interestRate) {
		console.log("Do I Qualify: " + interestRate);
	});

	recommendationForPrice(500000, function(recommendation) {
		console.log("Recommendation: " + recommendation);
	});
    });

  if(window.location.pathname.indexOf("Profile.htm") !== -1) {
	modifyZillowProfile();
  }
}

function recommendationForPrice(houseCost, callback) {
	globalStorage.getItem("userInfo", function(value) {
		var twentyPercent = Math.round(houseCost*.2);
		var tenPercent = Math.round(houseCost*.1);
		var threefivePercent = Math.round(houseCost*.035);
		
		var parsedJSON = JSON.parse(value);
		var totalLiquidAssets = parsedJSON.totalLiquidAssets;
		var creditScore = parsedJSON.creditScore;
		var monthlyIncome = parsedJSON.monthlyIncome;
		var yearlyIncome = monthlyIncome*12*1.3;
		
		if (twentyPercent <= totalLiquidAssets) {
			getInterestRate(houseCost, creditScore, yearlyIncome, Math.round(houseCost*.2), function(interestRate) {
				if (interestRate == null) {
					var recommendation = {
						"percentage" : 0,
						"monthlyPayment": 0,
						"interestRate": 0,
						"loanAmount": 0,
						"message": "Could not find a bank to give you the necessary loan"
					}
					callback(JSON.stringify(recommendation));
				} else {
					var c = interestRate /100 / 12;
					var payment = (houseCost*.8*c)*Math.pow((1+c), 360) / (Math.pow((1+c), 360)-1);
//					console.log("House Cost: " + houseCost);
//					console.log("Loan Amount: " + houseCost*.8);
//					console.log("Calculated c: " + c);
//					console.log("CalculatedPayment: " + payment);
					var recommendation = {
						"percentage" : 20,
						"monthlyPayment" : payment,
						"interestRate" : interestRate,
						"loanAmount" : houseCost*.8
					};
					callback(JSON.stringify(recommendation));
				}
			});
		}
		if (tenPercent <= totalLiquidAssets && totalLiquidAssets < twentyPercent) {
			getInterestRate(houseCost, creditScore, yearlyIncome, Math.round(houseCost*.1), function(interestRate) {
				if (interestRate == null) {
					var recommendation = {
						"percentage" : 0,
						"monthlyPayment": 0,
						"interestRate": 0,
						"loanAmount": 0,
						"message": "Could not find a bank to give you the necessary loan"
					}
					callback(JSON.stringify(recommendation));
				} else {
					var c = interestRate /100 / 12;
					var payment = (houseCost*.9*c)*Math.pow((1+c), 360) / (Math.pow((1+c), 360)-1);
//					console.log("House Cost: " + houseCost);
//					console.log("Loan Amount: " + houseCost*.9);
//					console.log("Calculated c: " + c);
//					console.log("CalculatedPayment: " + payment);
					var recommendation = {
						"percentage" : 10,
						"monthlyPayment" : payment,
						"interestRate" : interestRate,
						"loanAmount" : houseCost*.9
					};
					callback(JSON.stringify(recommendation));
				}
			});
		}
		if (threefivePercent <= totalLiquidAssets && totalLiquidAssets < tenPercent) {
			getInterestRate(houseCost, creditScore, yearlyIncome, Math.round(houseCost*.035), function(interestRate) {
				if (interestRate == null) {
					var recommendation = {
						"percentage" : 0,
						"monthlyPayment": 0,
						"interestRate": 0,
						"loanAmount": 0,
						"message": "Could not find a bank to give you the necessary loan"
					}
					callback(JSON.stringify(recommendation));
				} else {
					var c = interestRate /100 / 12;
					var payment = (houseCost*.965*c)*Math.pow((1+c), 360) / (Math.pow((1+c), 360)-1);
//					console.log("House Cost: " + houseCost);
//					console.log("Loan Amount: " + houseCost*.965);
//					console.log("Calculated c: " + c);
//					console.log("CalculatedPayment: " + payment);
					var recommendation = {
						"percentage" : 3.5,
						"monthlyPayment" : payment,
						"interestRate" : interestRate,
						"loanAmount" : houseCost*.965
					};
					callback(JSON.stringify(recommendation));
				}
			});
		}
		if (totalLiquidAssets < threefivePercent) {
			var recommendation = {
				"percentage" : 0,
				"monthlyPayment" : 0,
				"interestRate" : 0,
				"loanAmount" : 0,
				"message": "dont buy the place"
			};
			callback(JSON.stringify(recommendation));
		}
	});
}
function doIqualify(state, callback) {
	globalStorage.getItem("userInfo", function(value) {

		switch(state) {
			case "WA":
			case "Washington":
			case "washington":
				callback(doIQualifyInWashington(value));
				break;
			case "CA":
			case "California":
			case "california":
				callback(doIQualifyInCalifornia(value));
				break;
			default:
				break;
		}
	});
}

function doIQualifyInWashington(value) {

	var parsedJSON = JSON.parse(value);
	var isVeteran = parsedJSON.isVeteran;
	var isTeacher = parsedJSON.isTeacher;
	var isDisabled = parsedJSON.isDisabled;
	var householdSizeAdults = parsedJSON.householdSizeAdults;
	var householdSizeChildren = parsedJSON.householdSizeChildren;
	var totalInHousehold = householdSizeAdults+householdSizeChildren;
	var monthlyIncome = parsedJSON.monthlyIncome;
	var totalIncome = monthlyIncome * 12;

	if (totalIncome < 97000) {
		return true;
	}
	if (isVeteran && totalIncome < 88000) {
		return true;
	}
	if (isTeacher && totalIncome < 88000) {
		return true;
	}
	if (isDisabled && totalIncome < 88000) {
		return true;
	}
	if (totalInHousehold == 1 && totalIncome < 44000) {
		return true;
	}
	if (totalInHousehold == 2 && totalIncome < 51000) {
		return true;
	}
	if (totalInHousehold == 3 && totalIncome < 57000) {
		return true;
	}
	if (totalInHousehold == 4 && totalIncome < 63000) {
		return true;
	}
	if (totalInHousehold == 5 && totalIncome < 69000) {
		return true;
	}
	if (totalInHousehold == 6 && totalIncome < 74000) {
		return true;
	}
	if (totalInHousehold == 7 && totalIncome < 79000) {
		return true;
	}
	if (totalInHousehold == 8 && totalIncome < 84000) {
		return true;
	}

	return false;
}

function getComfortableHousePrice(value, callback) {

}

function getInterestRate(houseCost, creditScore, yearlyIncome, downpayment, callback) {
	var cookie = document.cookie;
	var guidCookie = getCookie("zguid");
	var decodeGuid = decodeURIComponent(guidCookie);
	var splitDecodeGuid = decodeGuid.split("|");
	var guidArray = splitDecodeGuid[1];
	var parsedGUIDArray = JSON.parse(guidArray);


	var creditScoreString = "";
//	console.log("creditScore: " + creditScore);
//	console.log("yearlyIncome: " + yearlyIncome);
//	console.log("downpayment: " + downpayment);
	if (creditScore >= 760) {
		creditScoreString = "R_760_";
	} else if (creditScore < 760 && creditScore >= 740) {
		creditScoreString = "R_740_759";
	} else if (creditScore < 740 && creditScore >= 720) {
		creditScoreString = "R_720_739";
	} else if (creditScore < 720 && creditScore >= 700) {
		creditScoreString = "R_700_719";
	} else if (creditScore < 700 && creditScore >= 680) {
		creditScoreString = "R_680_699";
	} else if (creditScore < 680 && creditScore >= 660) {
		creditScoreString = "R_660_679";
	} else if (creditScore < 660 && creditScore >= 640) {
		creditScoreString = "R_640_659";
	} else if (creditScore < 640 && creditScore >= 620) {
		creditScoreString = "R_620_639";
	} else if (creditScore < 620 && creditScore >= 600) {
		creditScoreString = "R_600_619";
	} else if (creditScore < 600 && creditScore >= 560) {
		creditScoreString = "R_560_599";
	} else if (creditScore < 560 && creditScore >= 300) {
		creditScoreString = "R_300_559";
	}
//	console.log("guid: " + parsedGUIDArray[0]);


	// R_760_& R_720_739
	var guid = parsedGUIDArray[0];
	var submitRequestUrl = 'https://mortgageapi.zillow.com/submitRequest?' +
		'property.type=SingleFamilyHome&' +
		'property.use=Primary&' +
		'property.zipCode=98112&' +
		'property.value=' + houseCost + '&' +
		'borrower.creditScoreRange=' + creditScoreString + '&' +
		'borrower.annualIncome=' + yearlyIncome + '&' +
		'purchase.downPayment=' + downpayment + '&' +
		'submittedForFeaturedLenders=true&' +
		'desiredPrograms.0=Fixed30Year&' +
		'partnerId=RD-FVBXMBZ&' +
		'userSessionId=' + guid
	
//	console.log("SubmitRequestUrl: " + submitRequestUrl);
	$.ajax({
  		url: submitRequestUrl
	}).done(function(submitRequestResponse) {
		//var submitRequestResponse = httpGet(submitRequestUrl);
		var requestId = submitRequestResponse.requestId;
//		console.log("Response: " + submitRequestResponse);
//		console.log("RequestId: " + requestId);
		var getQuotesUrl = 'https://mortgageapi.zillow.com/getQuotes?partnerId=RD-FVBXMBZ&requestRef.id=' + requestId;	
		
		setTimeout(function(){
			$.ajax({
				url: getQuotesUrl
			}).done(function(getQuotesResponse) {
//				console.log("GetQuotes Response: " + getQuotesResponse);
				for (var key in getQuotesResponse) {
//		      			console.log(key,":",getQuotesResponse[key]);
		  		}
		
				var quotes = getQuotesResponse["quotes"];
				var count = 0;
				var totalapr = 0;
				for (quote in quotes) {
					var curQuote = quotes[quote];
					var apr = JSON.stringify(curQuote["apr"]);
//					console.log("APR: " + apr);
					totalapr += parseInt(apr);
					count++;
				}
			
				if (count != 0) {
					var avgapr = totalapr/count;
//					console.log("average apr: " + avgapr);
					callback(avgapr);
				} else {
					callback(null);
				}
			});
		}, 10000);		
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

