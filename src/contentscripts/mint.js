function startMint() {
  globalStorage.getItem("grabFromMint", function(shouldGrabFromMint) {
    if(shouldGrabFromMint) {
      pullDataFromMint();
    }
  });
}

function pullDataFromMint() {
  if(window.location.pathname.indexOf("overview.event") === -1) {
    
    function monitorUrlChange() {
      // login page changes its url to overview page, but doesn't actually
      // load another page. look for that and if found act as if overview page
      // was loaded

      if(window.location.pathname.indexOf("overview.event") !== -1) {
        startMint();
      }
      else {
        setTimeout(monitorUrlChange, 100);
      } 
    }

    function updateLoginMessage() {
      var grabbingInfoMessage = $("<p class='error' style='display: block; background: #0074e4; border: 3px solid #03427E'>Please log in to import your information into Zillow.</p>");
      var originalMessage = $("#authError");

      if(originalMessage.length > 0) {
        $(".getsat").after(grabbingInfoMessage);
        originalMessage.remove();
      }
      else {
        // hasn't fully loaded yet, try again
        setTimeout(updateLoginMessage, 100);
      }
    }

    updateLoginMessage();
    monitorUrlChange();

    return;
  }
  else {
    function addIntegratingMessage() {
      var grabbingInfoMessage = $("<p id='zillow-integration-msg' class='error' style='display: block; text-align:left; background: #0074e4; border: 3px solid #03427E'>Importing your information into Zillow, please wait...</p>");
      var header = $("#body-header");

      if(header.length > 0) {
         header.append(grabbingInfoMessage);

         setInterval(function() {
          var message = $("#zillow-integration-msg");
          message.text(message.text() + ".");
         }, 500)
      }
      else {
        // hasn't fully loaded yet, try again

        setTimeout(addIntegratingMessage, 100);
      }
    }

    addIntegratingMessage();
  }

  setTimeout(function() {
    var mintInfo = {};

    // get liquid assets from mint
    var totalLiquidAssetsString = $("#moduleAccounts-bank .balance").first().text();
    
    if(totalLiquidAssetsString !== null && totalLiquidAssetsString !== "") {
      totalLiquidAssetsString = totalLiquidAssetsString.replace(/\$|,/g,"");

      mintInfo.totalLiquidAssets = parseFloat(totalLiquidAssetsString);

      // get credit score from mint
      var creditScoreString = $(".module-credit-score .score-number").first().text();

      if(creditScoreString) {
        mintInfo.creditScore = parseInt(creditScoreString);
      }

      // get about me information from mint
      $.ajax({
        url: "https://wwws.mint.com/htmlFragment.xevent?task=as-nav-content-about&rnd=" + (Math.random() * 100000000000000000)
      })
      .done(function(response) {
        var aboutMeHtml = $(response.xmlContent);
        
        var ageRange = aboutMeHtml.find("#as-nav-content-about-age option:selected").text();
        var gender = aboutMeHtml.find("#as-nav-content-about-male").parent().find("input:checked").val();
        var maritalStatus = aboutMeHtml.find("#as-nav-content-about-martial option:selected").text();
        var educationLevel = aboutMeHtml.find("#as-nav-content-about-education option:selected").text();
        var profession = aboutMeHtml.find("#as-nav-content-about-profession option:selected").text();
        var incomeRange = aboutMeHtml.find("#as-nav-content-about-income option:selected").text();
        var residentialStatus = aboutMeHtml.find("#as-nav-content-about-residential option:selected").text();
        var householdSizeAdults = aboutMeHtml.find("#as-nav-content-about-household-adults option:selected").text().split("")[0];
        var householdSizeChildren = aboutMeHtml.find("#as-nav-content-about-household-children option:selected").text().split("")[0];
      
        mintInfo.ageRange = ageRange;
        mintInfo.gender = gender;
        mintInfo.maritalStatus = maritalStatus;
        mintInfo.educationLevel = educationLevel;
        mintInfo.profession = profession;
        mintInfo.incomeRange = incomeRange;
        mintInfo.residentialStatus = residentialStatus;
        mintInfo.householdSizeAdults = householdSizeAdults;
        mintInfo.householdSizeChildren = householdSizeChildren;

        // get average net and gross income over last 5 months
        var currentDate = new Date();
        var sixMonthsAgoDate = new Date();//.setMonth(currentDate.getMonth() – 6);
        var csrfToken = sessionStorage.getItem("CSRF");
        
        var netIncomeSearchQuery = {
          "reportType": "NI",
          "chartType": "P",
          "comparison": "",
          "matchAny": true,
          "terms": [],
          "accounts" :{
            "groupIds": ["AA"],
            "accountIds": []
          },
          "dateRange": {
            "period": {
              "label": "Last 6 months",
              "value": "L6M"
            },
            "start": (sixMonthsAgoDate.getMonth() + 1) + "/" + sixMonthsAgoDate.getDate() + "/" + sixMonthsAgoDate.getFullYear(),
            "end": (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear()
          },
          "drilldown": null,
          "categoryTypeFilter": "all"
        }; 

        $.ajax({
          type: "POST",
          data: {
            token: csrfToken,
            searchQuery: JSON.stringify(netIncomeSearchQuery)
          },
          url: "https://wwws.mint.com/trendData.xevent"
        })
        .done(function(response) {
          var totalGrossIncomeLast5Months = 0;
          var totalNetIncomeLast5Months = 0;
          
          response.trendList.forEach(function(item, index) {
            // ignore latest month since it is not complete
            if(index < 5) {
              var income = item[0].value;
              var expense = item[1].value;

              totalNetIncomeLast5Months += (income + expense);
              totalGrossIncomeLast5Months += income;
            }
          });

          mintInfo.monthlyIncome = Math.round((totalGrossIncomeLast5Months / 5));
          mintInfo.averageMonthlyLeftOver = Math.round((totalNetIncomeLast5Months / 5));
        
          // get average mortgage / rent over last 5 months
          $.ajax({
            url: "https://wwws.mint.com/app/getJsonData.xevent?accountId=0&filterType=cash&queryNew=&offset=0&comparableType=8&acctChanged=T&task=transactions%2Ctxnfilters&rnd=733&query=category%3D%3A+Mortgage+%26+Rent&typeFilter=cash&typeSort=2"
          })
          .done(function(response) {
            var totalMortgageAndRentLast6Months = 0;
            var now = new Date();
            var sixMonthsAgoDateNum = now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000)

            response.set[0].data.forEach(function(item, index) {
              var paidDate = new Date(item.date);
              var numPayments = 0;

              if(item.date.indexOf("/") !== -1) {
                // date is in 'xx/xx/xx' form, it was parsed correctly
              }
              else {
                // date is in 'Jan 8' form, set correct year since that wasn't given
                // this form is only done for recent transactions

                if(paidDate.getMonth() > now.getMonth()) {
                  paidDate.setYear(now.getFullYear() - 1);
                }
                else {
                  paidDate.setYear(now.getFullYear());
                }
              }
              
              // ignore older than 6 months since it is not complete
              if(paidDate.getTime() > sixMonthsAgoDateNum) {
                var pricePaid = parseFloat(item.amount.replace(/\$|,/g,""));
                
                numPayments ++;
                totalMortgageAndRentLast6Months += pricePaid;
              } 
            });

            mintInfo.monthlyHousingCost = Math.round((totalMortgageAndRentLast6Months / 5));

            console.log(mintInfo);
            
            globalStorage.setItem("mintInfo", JSON.stringify(mintInfo));
            globalStorage.setItem("grabFromMint", false);

            window.close();
          });
        });
      });
    }
    else {
      startMint();
    }
  }, 10000);
}