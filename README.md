Aliens vs Predator vs. Brown vs. Board of Education: Zillow Personal Advisor

The purpose of this app is to provide the Zillow user with a more personalized experience during his/her home search.

This application was developed February 6-8th, 2015 for the Hack Housing Zillow Hackathon.

Our app is live at https://github.com/jodoglevy/HackHousingProject.

Challenge and Approach

Our submission addresses portions across all challenges especially for first time and lower income home buyers.

Our approach for satisfying this challenge was to:

    Integrate with Mint to pull financial information 
    Based on the information from Mint there are multiple applications to that data
	Provide user with federal aid plans for home loans if they qualify
    	Provide user with recommendation on specific homes like down percentage
	Provide user with a max house cost that can be used to filter houses on map

Team Members

Our team is comprised of:

    Adam Levine - The Canadian 
    Joe Levy - Guy who faked breaking his leg skiing then broke his leg skiing
    Mason Meier - Charmason
    Stephen Han - README author

Technologies, APIs, and Datasets Utilized

We made use of:

    mint.com - scrape data from HTML and make use of internal API to gather other information
    zillow.com - "hacked" several portaions of zillow
	Modify Map canvas drawing via proxy background.js to show houses user can afford/hide houses user can't afford
	Make use of internal API zillow uses to get bank interest rate based on loan amount and down payment
    Active Housing Counseling Agencies - return counseling agencies nearby if user qualifies for HUD program

Contributing

In order to build and run our app:

    	Clone the git repository
	Open Google Chrome
	Chrome menu: More Tools -> Extensions  
	Load Unpacked Extension
	Select file directory of the cloned repository
	Enable the extension!

Our code is licensed under the MIT License. Pull requests will be accepted to this repo, pending review and approval.