var results = [];
var repeat_big = 0;
var repeat_medium = 0;
const fs = require('fs');
const request = require('request');

let companies_test = [
  {"id":1,"name":"Sysco","linkedin_url":"https://www.linkedin.com/sales/accounts/insights?companyId=5343","website":"http://www.sysco.com","geography":"Houston, Texas Area","industry":"Food","company_headcount":"10001","employees_on_linkedin":"14,814 employees on LinkedIn","companyId":"5343","description":"Sysco is the global leader in selling, marketing and distributing food products to restaurants, healthcare and educational facilities, lodging establishments and other customers who prepare meals away from home. Its family of products also includes equipment and supplies for the foodservice and hospitality industries. With over 65,000 associates, the company operates approximately 300 distribution facilities across the globe and serves more than 500,000 customer locations. For fiscal year 2017 that ended July 1, 2017, the company generated sales of more than $55 billion.\n\nFor more information about Sysco, visit www.sysco.com. Connect with Sysco on Facebook at www.facebook.com/syscocorporation and on Twitter at www.twitter.com/sysco."},
  {"id":2,"name":"Nike","linkedin_url":"https://www.linkedin.com/sales/accounts/insights?companyId=2029","website":"http://jobs.nike.com/","geography":"Portland, Oregon Area","industry":"Sporting Goods","company_headcount":"10001","employees_on_linkedin":"56,202 employees on LinkedIn","companyId":"2029","description":"NIKE, Inc., named for the Greek goddess of victory, is the world's leading designer, marketer, and distributor of authentic athletic footwear, apparel, equipment, and accessories for a wide variety of sports and fitness activities. \n\nOperating segments for the Nike brand are: North America, Europe, Middle East and Africa, Greater China, Asia Pacific and Latin America. Wholly-owned subsidiaries include Converse Inc., which designs, markets, and distributes casual footwear, apparel and accessories, and Hurley International LLC, which designs, markets, and distributes action sports and youth lifestyle footwear, apparel and accessories. The company was founded by Bill Bowerman and Phil Knight in 1972 and is headquartered in Beaverton, Oregon.\n\nFor more information, visit our company site at www.nike.com or our career site at www.jobs.nike.com."}
]

for (i = 0; i < companies_test.length; i++) {

  function push_best_email(company_info) {
    url = 'http://127.0.0.1:8000/company/' + company_info['id'] + '/'
    console.log(url)
    employee_first_name = "First";
    employee_last_name = "Last";
    employee_email = "email@email.com";
    employee_position = "Lead Person";

    request({
        uri: url,
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: {employee_first_name: employee_first_name,
              employee_last_name: employee_last_name,
              employee_email: employee_email,
              employee_position: employee_position},
              json: true
    }, (error, response, body) => {
      if (error)
        console.log("error")
    })

    return 0
  }

  push_best_email(companies_test[i])

  console.log(i)
}
