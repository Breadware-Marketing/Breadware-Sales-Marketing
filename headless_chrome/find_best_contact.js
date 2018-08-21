var results = [];
var repeat_big = 0;
var repeat_medium = 0;
const fs = require('fs');
const request = require('request');

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
  "packaging",
  "retired"
];

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
  },
  {
    position: "manager",
    less_than_50: 0.5,
    greater_than_50_less_than_1000: 0.5,
    greater_than_1000_employees: 0.5
  },
  {
    position: "r&d",
    less_than_50: 15,
    greater_than_50_less_than_1000: 15,
    greater_than_1000_employees: 15
  }
];


let companies_test = [];

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
    "AQEDARpZzHQC4dNOAAABZLAp9W4AAAFk1DZ5blYAstAslekZ9Qyjnpd03E_IcoW02rhe2kqUn1cR9Lw0cP5LMZ0aRkOCuGzo2u4f1udnZraEfbgtQTYmkG6hpBNd9bLar5qgGNgj7HRnilPQoblFGBmB",
  domain: "www.linkedin.com"
};

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    // headless: false
  });

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
              email: ''
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
      try {
        for (let pL of potential_leads) {
          pL = calculate_cool_score(pL, number_of_employees);
        }

        // Show Only Relevant Results
        for (let pL of potential_leads) {
          if (pL.cool >= 15) {
            leadsWithCoolPoints.push(pL);
          }
        }

        var highest_lead_score = 0;
        var highest_lead = '';

        if (leadsWithCoolPoints.length == 0) {
          console.log("No One Was Cool Enough");
        }
        else if (leadsWithCoolPoints.length > 0){

          for (human of leadsWithCoolPoints) {
            if (human['cool'] > highest_lead_score) {
              highest_lead_score = human['cool'];
              highest_lead = human;
            }
          }
        }

        return highest_lead;
      } catch (err) {
        return {"email": 'None'}
      }
    }

    function push_best_email_file(company_leads) {
      if (company_leads != '') {
        name = "name=" + company_leads['name'];
        url = "&url=" + company_leads['company_website'];

        var options = {
            url: 'https://email-finder-breadware.herokuapp.com/api?' + name + url,
            method: 'GET'
        };

        var email;

        try {
          request(options, function(err, res, body) {
            try {
              email = JSON.parse(body)['email'];
            }
            catch (err) {
              email = 'None'
            }
            email = email[1].length > 1 ? email[0] : email;
            company_leads['email'] = email;
            console.log(email)
            if (email != "None")
              fs.appendFileSync('leads.txt', '\n' + JSON.stringify(company_leads) + ',');
            if (email == "Tell Ed This is Happening") {
              console.log("-------------------------")
              console.log("Tell Ed This is Happening")
              console.log(company_leads)
              console.log("Tell Ed This is Happening")
              console.log("-------------------------")
            }
            return 0;
          })
        } catch(err) {
          email = 'None';
        }
      }

      return 0
    }

    // results.push(lists(leads))
    push_best_email_file(lists(leads))
    console.log(i)

    await page.close();
  }
  // console.log(results);
  await browser.close();
})();
