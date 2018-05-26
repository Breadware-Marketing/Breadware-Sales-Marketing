var results = [];
var repeat_big = 0;
var repeat_medium = 0;
const fs = require('fs');

//Goes off Indian Caste System, If you don't know it, pick up a fucking book
const untouchable = [
  "affairs",
  "tax",
  "finance",
  "accounting",
  "marketing",
  "software",
  "communications",
  "intern",
  "investor",
  "assistant",
  "taxes",
  "relations",
  "creative",
  "fp&a",
  "safety",
  "hr",
  "recruiter",
  "pr",
  "talent",
  "sales",
  "business",
  "supply",
  "estate",
  "legal",
  "payroll",
  "risk",
  "fellow",
  "sourcing",
  "human",
  "treasurer",
  "compliance",
  "technician",
  "packaging"
]; // investor, assistant

// Slighty Touchable - You still shouldn't touch them though
const sudra = ["app"];

// Desireables get a +2 Boost
const kshatriyas = ["engineering", "electronics", "product", "development"];

// StopGap Words Found in Title - Adding to This List will Remove the Word From Titles
const stopgap_words = ["of", "and", "for", "at", "to", "the"];

// hierarchy of fish
const big_fish = ["cto", "ceo", "founder", "owner", "president", "director"];

const medium_fish = ["vice", "v.p.", "vp", "senior", "sr."];
// const medium_fish = [];

const custom_scores = [
  {
    position: "cto",
    less_than_50: 8,
    greater_than_50_less_than_1000: 6,
    greater_than_1000_employees: 3
  },
  {
    position: "iot",
    less_than_50: 5,
    greater_than_50_less_than_1000: 5,
    greater_than_1000_employees: 5
  },
  {
    position: "ceo",
    less_than_50: 6,
    greater_than_50_less_than_1000: 4,
    greater_than_1000_employees: 1
  },
  {
    position: "coo",
    less_than_50: 5,
    greater_than_50_less_than_1000: 3,
    greater_than_1000_employees: 2
  },
  {
    position: "founder",
    less_than_50: 6,
    greater_than_50_less_than_1000: 4,
    greater_than_1000_employees: -5
  },
  {
    position: "owner",
    less_than_50: 6,
    greater_than_50_less_than_1000: 3,
    greater_than_1000_employees: -8
  },
  {
    position: "director",
    less_than_50: 4,
    greater_than_50_less_than_1000: 4,
    greater_than_1000_employees: 4
  },
  {
    position: "president",
    less_than_50: 6,
    greater_than_50_less_than_1000: 4,
    greater_than_1000_employees: -5
  },
  {
    position: "vice",
    less_than_50: -2,
    greater_than_50_less_than_1000: 0,
    greater_than_1000_employees: 9
  },
  {
    position: "chairman",
    less_than_50: -5,
    greater_than_50_less_than_1000: -5,
    greater_than_1000_employees: -5
  },
  {
    position: "v.p.",
    less_than_50: 4,
    greater_than_50_less_than_1000: 4,
    greater_than_1000_employees: 4
  },
  {
    position: "vp",
    less_than_50: 4,
    greater_than_50_less_than_1000: 4,
    greater_than_1000_employees: 4
  },
  {
    position: "senior",
    less_than_50: 0.5,
    greater_than_50_less_than_1000: 0.5,
    greater_than_1000_employees: 0.5
  },
  {
    position: "sr.",
    less_than_50: 0.5,
    greater_than_50_less_than_1000: 0.5,
    greater_than_1000_employees: 0.5
  },
  {
    position: "manager",
    less_than_50: 0.5,
    greater_than_50_less_than_1000: 0.5,
    greater_than_1000_employees: 0.5
  }
];

let companies_test = [

{
    "id": 172,
    "name": "American Plastic Toys Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=22341402",
    "website": "http://americanplastictoys.com",
    "geography": "Greater Detroit Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "57 employees on LinkedIn",
    "companyId": "22341402"
},
{
    "id": 173,
    "name": "Anagram International",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=137954",
    "website": "http://www.anagramballoons.com",
    "geography": "United States",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "164 employees on LinkedIn",
    "companyId": "137954"
},
{
    "id": 174,
    "name": "Anchor Industries, Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1416444",
    "website": "http://www.anchorinc.com",
    "geography": "Evansville, Indiana Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "99 employees on LinkedIn",
    "companyId": "1416444"
},
{
    "id": 175,
    "name": "Annie's Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=67128",
    "website": "http://www.annies.com",
    "geography": "San Francisco Bay Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "132 employees on LinkedIn",
    "companyId": "67128"
},
{
    "id": 176,
    "name": "Apex International Mfg, Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2295825",
    "website": "http://www.trustapexinternational.com",
    "geography": "Greater Minneapolis-St. Paul Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "93 employees on LinkedIn",
    "companyId": "2295825"
},
{
    "id": 177,
    "name": "Apothecary Products",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3680164",
    "website": "http://www.apothecaryproducts.com",
    "geography": "Greater Minneapolis-St. Paul Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "111 employees on LinkedIn",
    "companyId": "3680164"
},
{
    "id": 178,
    "name": "Aprilaire, a Division of Research Products Corporation",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=85193",
    "website": "http://www.aprilaire.com",
    "geography": "Madison, Wisconsin Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "208 employees on LinkedIn",
    "companyId": "85193"
},
{
    "id": 179,
    "name": "Arden Companies",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=417987",
    "website": "http://www.ardencompanies.com",
    "geography": "Greater Detroit Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "169 employees on LinkedIn",
    "companyId": "417987"
},
{
    "id": 180,
    "name": "Arett Sales",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=151868",
    "website": "http://www.arett.com",
    "geography": "Greater Philadelphia Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "91 employees on LinkedIn",
    "companyId": "151868"
},
{
    "id": 181,
    "name": "Ariat International",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=51205",
    "website": "http://www.ariat.com",
    "geography": "United States",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "403 employees on LinkedIn",
    "companyId": "51205"
},
{
    "id": 182,
    "name": "ASG Brands",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=6929129",
    "website": "http://www.asgbrands.com",
    "geography": "Dallas/Fort Worth Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "59 employees on LinkedIn",
    "companyId": "6929129"
},
{
    "id": 183,
    "name": "Ashley Ward, Inc",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2123281",
    "website": "http://www.ashleyward.com",
    "geography": "Cincinnati, Ohio Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "54 employees on LinkedIn",
    "companyId": "2123281"
},
{
    "id": 184,
    "name": "Astor Chocolate",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=140594",
    "website": "http://www.astorchocolate.com/",
    "geography": "Greater New York City Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "112 employees on LinkedIn",
    "companyId": "140594"
},
{
    "id": 185,
    "name": "AZUMA Leasing",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=87629",
    "website": "http://www.azuma.com",
    "geography": "Austin, Texas Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "62 employees on LinkedIn",
    "companyId": "87629"
},
{
    "id": 186,
    "name": "B",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=87862",
    "website": "http://www.bowers-wilkins.com",
    "geography": "United States",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "150 employees on LinkedIn",
    "companyId": "87862"
},
{
    "id": 187,
    "name": "Backyard Discovery/Leisure Time",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1481054",
    "website": "http://backyarddiscovery.com",
    "geography": "Joplin, Missouri Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "60 employees on LinkedIn",
    "companyId": "1481054"
},
{
    "id": 188,
    "name": "Backyard Products LLC",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1847386",
    "website": "https://www.backyardproducts.com/",
    "geography": "Greater Detroit Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "90 employees on LinkedIn",
    "companyId": "1847386"
},
{
    "id": 189,
    "name": "Basco Shower Enclosures",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=615336",
    "website": "http://www.bascoshowerdoor.com",
    "geography": "Cincinnati, Ohio Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "92 employees on LinkedIn",
    "companyId": "615336"
},
{
    "id": 190,
    "name": "Basic Research",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=19959",
    "website": "http://www.basicresearch.org",
    "geography": "United States",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "181 employees on LinkedIn",
    "companyId": "19959"
},
{
    "id": 191,
    "name": "Battery Systems",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=952694",
    "website": "http://www.batterysystems.net",
    "geography": "Orange County, California Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "167 employees on LinkedIn",
    "companyId": "952694"
},
{
    "id": 192,
    "name": "BEDGEAR",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1961110",
    "website": "http://www.bedgear.com",
    "geography": "Greater New York City Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "119 employees on LinkedIn",
    "companyId": "1961110"
},
{
    "id": 193,
    "name": "Bell Laboratories, Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=9235655",
    "website": "http://www.belllabs.com",
    "geography": "Madison, Wisconsin Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "116 employees on LinkedIn",
    "companyId": "9235655"
},
{
    "id": 194,
    "name": "Bentley Laboratories, LLC",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1963090",
    "website": "http://www.bentleylabs.com",
    "geography": "Greater New York City Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "90 employees on LinkedIn",
    "companyId": "1963090"
},
{
    "id": 195,
    "name": "Beretta USA",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=51185",
    "website": "http://www.beretta.com/en-us/",
    "geography": "Greater Nashville Area, TN",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "226 employees on LinkedIn",
    "companyId": "51185"
},
{
    "id": 196,
    "name": "Bigelow Tea",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=112225",
    "website": "http://www.bigelowtea.com",
    "geography": "Greater New York City Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "152 employees on LinkedIn",
    "companyId": "112225"
},
{
    "id": 197,
    "name": "Blendtec",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=80193",
    "website": "http://www.blendtec.com",
    "geography": "Provo, Utah Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "203 employees on LinkedIn",
    "companyId": "80193"
},
{
    "id": 198,
    "name": "Blistex Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=51209",
    "website": "http://www.blistex.com",
    "geography": "Greater Chicago Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "181 employees on LinkedIn",
    "companyId": "51209"
},
{
    "id": 199,
    "name": "Boots Retail USA, Inc.",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5208278",
    "website": "http://www.walgreensbootsalliance.com",
    "geography": "Greater New York City Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "782 employees on LinkedIn",
    "companyId": "5208278"
},
{
    "id": 200,
    "name": "Border Foods Inc",
    "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=688137",
    "website": "http://borderfoodsinc.com",
    "geography": "Dallas/Fort Worth Area",
    "industry": "Consumer Goods",
    "company_headcount": "",
    "employees_on_linkedin": "91 employees on LinkedIn",
    "companyId": "688137"
}
];

// Checks Whether a Value is in a Given Array and Returns True or False
const is_in_array = function(s, your_array) {
    for (var i = 0; i < your_array.length; i++) {
        if (your_array[i].toLowerCase() === s.toLowerCase()) return true;
    }
    return false;
};

//Delay Shit
const waitFor = function(timeToWait) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, timeToWait);
    });
};

// Takes Position, Cleans it, and Returns and Array of Keywords
function clean_position_array(position) {
    position = position.toLowerCase();
    position = position.replace(/[-\/\\^$*+?,()|[\]{}]/g, " ").replace(/&amp;/g, " ");
    //Remove Extra Spaces
    let clean_position = position.replace(/\s+/g, " ").trim();
    //Convert to Array
    var initial_array = clean_position.split(" ").map(String);

    //Remove Stop Gap Words and Return New Array
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {
        return a.indexOf(i) < 0;
        });
    };

    diff = initial_array.diff(stopgap_words);

    repeat_big = 0;
    repeat_medium = 0;

    for (var i = 0; i < diff.length; i++) {
        if ((is_in_array(diff[i], big_fish))) {
        // console.log(diff[i])
        repeat_big += 1;
        } else if (is_in_array(diff[i], medium_fish)) {
        repeat_medium += 1;
        }
        if (repeat_big > 1 || repeat_medium > 1) {
        diff[i] = "---";
        }
    }

    return diff;
}

function calculate_cool_score(data, company_employee_count) {
    // Call Function to Turn Title Into Keywords
    position = clean_position_array(data.position);

    // Get Rid of those Filthy Street Cleaners
    untouchable.forEach(function(entry) {
      // Looks For Overlap Between Untouchables and Title Keywords
      if (is_in_array(entry, position)) {
        data.cool -= 5;
      }
    });

    // Get Rid of the Commoners
    sudra.forEach(function(entry) {
      // Looks For Overlap Between Sudra and Title Keywords
      if (is_in_array(entry, position)) {
        data.cool -= 2;
      }
    });

    // Boost Some Keywords
    kshatriyas.forEach(function(entry) {
      // Looks For Overlap Between Sudra and Title Keywords
      if (is_in_array(entry, position)) {
        data.cool += 2;
      }
    });

    // Under Employee Special Logic
    for (var a = 0; a < custom_scores.length; a++) {
      // See if Position in Array Matches Keyword in Title
      if (is_in_array(custom_scores[a].position, position)) {
        // Special Logic for <= 50 Employees
        if (company_employee_count <= 50) {
          data.cool += custom_scores[a].less_than_50;
        }
        // Special Logic for > 50 and < 1000 Employees
        else if (
          company_employee_count > 50 &&
          company_employee_count <= 1000
        ) {
          data.cool += custom_scores[a].greater_than_50_less_than_1000;
        }
        // Special Logic for > 1000 Employees
        else if (company_employee_count > 1000) {
          data.cool += custom_scores[a].greater_than_1000_employees;
        }
      }
    }
    return data;
}

const cookie = {
  name: "li_at",
  value:
    "AQEDARpZzHQCEiCuAAABY1H8eAQAAAFjmnMEAFYAO7MAYzZ3O3h_LH-pw0LYImAiaQ56GUPmlTW-OYb9jFKX52vDnUAXBgjROa_oX3APsoq4zeHZuo4iH4UsRGF3QRRQzjnuz02bGDWGBZo3FYBE45sZ",
  domain: "www.linkedin.com"
};

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  
  for (i = 0; i < companies_test.length; i++) {
    const page = await browser.newPage();
    await page.setCookie(cookie);
    await page.exposeFunction('is_in_array', is_in_array);
    await page.exposeFunction('waitFor', waitFor);
    await page.exposeFunction('clean_position_array', clean_position_array);
    await page.exposeFunction('calculate_cool_score', calculate_cool_score);
    await page.goto("https://www.linkedin.com/sales/search?pivotType=EMPLOYEE&count=100&facet=G&facet=CC&facet.G=us%3A0&pivotId=" + companies_test[i].companyId, { waitUntil: "networkidle0" }).catch(error => console.log("Couldn't go to the page", error));
    await page.waitFor(5000);

    // Pulls List of Potential Leads From the Page
    const leads = await page
      .evaluate((companies_test, i) => {
        //otherwise the transpiler will rename it and won't work
        const $ = window.$;
        //Setup Vars
        var potential_leads = [];
        // Access Dom and Pull List of Potential Leads
        function rid_of_amp(name) {
          new_name = name;
          if (name.includes("&amp;")) {
            new_name = name.replace(/&amp;/g, "&");
          }
          return new_name;
        }

        try {
          var allData = document.querySelectorAll("#results-list > .result");
          $.each(allData, function(index, value) {
            potential_leads.push({
              name: rid_of_amp(
                value.getElementsByClassName("name-link")[0].innerHTML
              ),
              position: rid_of_amp(
                value
                  .getElementsByClassName("info")[0]
                  .getElementsByTagName("p")[0].innerHTML
              ),
              url: value.getElementsByClassName("image-wrapper")[0].href,
              cool: 0,
              company_name: companies_test[i].name,
              company_website: companies_test[i].website,
            });
          });
          return potential_leads;
        } catch (err) {
          console.log("Initial Data Could Not be Loaded.", err);
        }
      }, companies_test, i)
      .catch(error => console.log("Shit Hits the fan in here", error));

    const number_of_employees = await page.evaluate(() => {
      try {
        let string_of_employees = document.getElementsByClassName(
          "page-heading"
        )[0].innerHTML;
        var number = string_of_employees
          .substring(string_of_employees.length - 10)
          .match(/\d/g);
        let employees = number.join("");
        return employees;
      } catch (error) {
        console.log("Why is this happening?", error);
      }
    });

    function lists(potential_leads) {
      leadsWithCoolPoints = []
      for (let pL of potential_leads) {
        pL = calculate_cool_score(pL, number_of_employees);
      }

      // Show Only Relevant Results
      for (let pL of potential_leads) {
        if (pL.cool > 3) {
          leadsWithCoolPoints.push(pL);
          fs.appendFileSync('leads.txt', '\n' + JSON.stringify(pL) + ',');
        }
      }

      if (leadsWithCoolPoints.length == 0) {
        console.log("No One Was Cool Enough");
      } 
      else if (leadsWithCoolPoints > 1){
        len = leadsWithCoolPoints.length - 1;
        for (let j = 0; j < 1000000; j++) {
          if (leadsWithCoolPoints[j % len].cool < leadsWithCoolPoints[j % len + 1].cool) {
            temp = leadsWithCoolPoints[j % len];
            leadsWithCoolPoints[j % len] = leadsWithCoolPoints[j % len + 1];
            leadsWithCoolPoints[j % len + 1] = temp;
          }
        }
      }
      return leadsWithCoolPoints
    }

    results.push(lists(leads))
    await page.close();
  }
  console.log(results);
  await browser.close();
})();
