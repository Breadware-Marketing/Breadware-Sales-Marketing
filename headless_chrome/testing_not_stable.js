let companies_test = [
  {
    id: 5,
    name: "Fortune Brands Home",
    linkedin_url:
      "https://www.linkedin.com/sales/accounts/insights?companyId=2394652",
    website: "http://www.fbhs.com",
    geography: "United States",
    industry: "Consumer Goods",
    company_headcount: "",
    employees_on_linkedin: "250 employees on LinkedIn",
    companyId: "2394652"
  },
  {
    id: 6,
    name: "GE Power",
    linkedin_url:
      "https://www.linkedin.com/sales/accounts/insights?companyId=1021",
    website: "",
    geography: "Albany, New York Area",
    industry: "Oil",
    company_headcount: "10001",
    employees_on_linkedin: "",
    companyId: "1021"
  },
  {
    id: 7,
    name: "Oxy",
    linkedin_url:
      "https://www.linkedin.com/sales/accounts/insights?companyId=165370",
    website: "",
    geography: "Houston, Texas Area",
    industry: "Oil",
    company_headcount: "10001",
    employees_on_linkedin: "",
    companyId: "165370"
  }
];

const puppeteer = require("puppeteer");
const cookie = {
    name: "li_at",
    value:
      "AQEDARpZzHQFPQ5-AAABYtF7yrYAAAFjQx6S91YAW3YXb56-ktM5zzVqOU_LMcdd4OxDgXH5ZIaBI6D5fZ1KlY_omQqKxs7HUdCCX-MXshnOZIIdkQKkHEjFh-ej46CRglQsTy2zKBHhF81CwEv0nP6K",
    domain: "www.linkedin.com"
};

async function processArray(array){
    const browser = await puppeteer.launch();

    async function pull_data(url){
        await page.goto(url, {waitUntil: 'networkidle0'});
        await page.evaluate(() => {
            const $ = window.$;
            const data = [];
            try {
                data.push({
                    website: $('.website').attr('href').replace(/(\r\n\t|\n|\r\t)/gm,"").trim(),
                    employees: ($('.cta-link').text()).replace(/(\r\n\t|\n|\r\t)/gm,"").trim()
                });
            }
            catch (err){
                data.push({
                    website: '',
                    employees: ($('.cta-link').text()).replace(/(\r\n\t|\n|\r\t)/gm,"").trim()
                });
            }
            return data;
        });
        return values;
    };

    async function processArray(array){
        array.forEach(async (company) => {
            const page = await browser.newPage();
            await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
            await page.setCookie(cookie);
            let data = await pull_data(company.linkedin_url);
            console.log(data);
        })
        console.log("Done!")
    }
    processArray(array);
    await browser.close();
}

processArray(companies_test);






// (async () => {
//   const browser = await puppeteer.launch();
//   for (i=0; i < companies_test.length; i++){
//     const page = await browser.newPage();
//     await page.setCookie(cookie);
//     await page.goto(companies_test[i].linkedin_url, {waitUntil: 'networkidle0'});
//     const values = await page.evaluate(() => {
//       const $ = window.$; //otherwise the transpiler will rename it and won't work
//       const data = [];
//       try {
//         data.push({
//           website: $('.website').attr('href').replace(/(\r\n\t|\n|\r\t)/gm,"").trim(),
//           employees: ($('.cta-link').text()).replace(/(\r\n\t|\n|\r\t)/gm,"").trim()
//         });
//       }
//       catch (err){
//         data.push({
//           website: '',
//           employees: ($('.cta-link').text()).replace(/(\r\n\t|\n|\r\t)/gm,"").trim()
//         });
//       }
//       return data;
//     });

//     companies_test[i].website = values[0].website;   
//     companies_test[i].employees_on_linkedin = values[0].employees;   

//     console.log(JSON.stringify(companies_test[i])+ ',');
//     await page.pdf({path: 'sample.pdf', format: 'A4'});
//     await page.close();
//   }
//   await browser.close()
// })()