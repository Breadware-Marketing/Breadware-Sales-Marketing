const cookie = {
  name: 'li_at',
  value: 'AQEDARpZzHQFQnEgAAABY9ebJLsAAAFkKar9olYAeES_6fWi2Cx1FPfood4DXO_78LT2CWQRHe1_0ls2BuOlZmU_SBgjvV8aFAxhcZP98Oosrb7woJuDrN4ZkYW8YJdm60N5lllOd2Qn_Gkx99l4zHaH',
  domain: 'www.linkedin.com',
};

const puppeteer = require('puppeteer');
const request = require('request');

// getting company get_info
async function get_info(companyId) {
  const linkedin_url = "https://www.linkedin.com/sales/accounts/insights?companyId=" + companyId;
  const browser = await puppeteer.launch({
    // headless: false
  });
  const page = await browser.newPage();
  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
  await page.setCookie(cookie);
  await page.goto(linkedin_url, {waitUntil: 'networkidle0'});
  const values = await page.evaluate(() => {
    const $ = window.$; //otherwise the transpiler will rename it and won't work
    const data = [];
    try {
      website = $('.website').attr('href').replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
      employees = ($('.cta-link').text()).replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
    }
    catch (err){
      website = '';
      employees = ($('.cta-link').text()).replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
    }

    try {
      $('.topcard-see-more-link').click()
      description = ($('.topcard-extended-description-modal-content-text').text()).replace(/(\r\n)/gm,"").trim();
    } catch (err) {
      description = ''
    }

    data.push({
      website: website,
      employees: employees,
      description: description
    })
    return data;
  });
  await page.close();
  await browser.close()
  return values;
}

// getting the top lead's info
async function get_lead(companyId, website) {
  const browser = await puppeteer.launch({
  });

  const page = await browser.newPage();
  await page.setCookie(cookie);
  await page.exposeFunction('is_in_array', is_in_array);
  await page.exposeFunction('waitFor', waitFor);
  await page.exposeFunction('clean_position_array', clean_position_array);
  await page.exposeFunction('calculate_cool_score', calculate_cool_score);
  await page.goto("https://www.linkedin.com/sales/search?pivotType=EMPLOYEE&count=100&facet=G&facet=CC&facet.G=us%3A0&pivotId=" + companyId, { waitUntil: "networkidle0" }).catch(error => console.log("Couldn't go to the page", error));
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
        if (pL.cool >= 3) {
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

  const person = await push_best_email_file((company_lead) => {
    if (company_lead['email'] != 'None') {
      name = "name=" + company_lead['name'];
      url = "&url=" + company_lead['company_website'];

      var options = {
          url: 'https://email-finder-breadware.herokuapp.com/api?' + name + url,
          method: 'GET'
      };

      var email;

      try {
        request(options, function(err, res, body) {
          try {
            email = JSON.parse(body)['email'];
          } catch (err) {
            email = 'None'
          }
          email = email[1].length > 1 ? email[0] : email;
          company_lead['email'] = email;

          // split first and last name
          name = company_lead['name'];
          first_name = name.slice(0, name.indexOf(" "));
          last_name = name.slice(name.indexOf(" ") + 1);

          if (email != "None") {
            return {employee_first_name: first_name,
                      employee_last_name: last_name,
                      employee_email: company_lead['email'],
                      employee_position: company_lead['position']}
          } else if (email == "Tell Ed This is Happening") {
            return {"error": "Tell ed this is happening"}
          }
          return 0;
        })
      } catch(err) {
        return {employee_first_name: first_name,
                  employee_last_name: last_name,
                  employee_email: "None",
                  employee_position: company_lead['position']}
      }
    }

    return {"warning":"No good people"}
  });

  await page.close();
  await browser.close();

  return person;
};

module.exports = {
  get_additional_comp_info: function(companyId) {
    return get_info(companyId);
  },
  find_best_lead: function(companyId, website) {
    return get_lead(companyId, website);
  }
};
