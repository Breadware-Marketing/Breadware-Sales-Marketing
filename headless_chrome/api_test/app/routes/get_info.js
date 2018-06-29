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
    // headless: falsew
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
  await browser.close();
  return values;
}

module.exports = {
  get_additional_comp_info: function(companyId) {
    return get_info(companyId);
  }
};//
