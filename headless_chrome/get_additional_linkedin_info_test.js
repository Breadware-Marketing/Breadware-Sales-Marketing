let companies_test = [
    {
        "id": 809,
        "name": "Columbia Distributing",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=35905",
        "website": "",
        "geography": "United States",
        "industry": "Food",
        "company_headcount": "1001-5000",
        "employees_on_linkedin": "",
        "companyId": "35905"
    }
  ]

const cookie = {
  name: 'li_at',
  value: 'AQEDARpZzHQFQnEgAAABY9ebJLsAAAFj-6eou1YAfNR5_d6KhRZAriCJE26ia01CRtH_OTw6cPS3D3MY0Uoaj4BP3bji4DCg3nC1nOfEIfuDD_lrSYXezO5TTUXX2ozmRn0_g-lOWwuZgmZsSbFmEKZW',
  domain: 'www.linkedin.com',
};

const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require('request');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
  await page.setCookie(cookie);
  await page.goto(companies_test[0].linkedin_url, {waitUntil: 'networkidle0'});
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

  companies_test[0].website = values[0].website;
  companies_test[0].employees_on_linkedin = values[0].employees;
  companies_test[0].description = values[0].description;

  fs.appendFileSync('test_company_info.txt', '\n' + JSON.stringify(companies_test[i]) + ',');
  console.log(JSON.stringify(companies_test[0])+ ',');
  // await page.pdf({path: 'sample.pdf', format: 'A4'});
  await page.close();
  await browser.close()
})()
