function startMint() {
  
  if(!(globalStorage.getItem("grabFromMint") || true)) {
    return;
  }

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

        console.log(mintInfo);
        globalStorage.setItem("mintInfo", JSON.stringify(mintInfo));

        window.close()
      });

    }
    else {
      startMint();
    }
  }, 10000)
}