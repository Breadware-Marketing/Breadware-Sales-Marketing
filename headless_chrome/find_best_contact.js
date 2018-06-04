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
  }
];

let companies_test = [
    {
        "id": 607,
        "name": "Ankit",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=833287",
        "website": "http://www.shopankit.com",
        "geography": "West Palm Beach, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "91 employees on LinkedIn",
        "companyId": "833287"
    },
    {
        "id": 608,
        "name": "ANN SACKS Tile",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=98753",
        "website": "http://annsacks.com/",
        "geography": "Portland, Oregon Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "207 employees on LinkedIn",
        "companyId": "98753"
    },
    {
        "id": 609,
        "name": "Aosom",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2381020",
        "website": "https://www.aosom.com",
        "geography": "Portland, Oregon Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "2381020"
    },
    {
        "id": 610,
        "name": "Apex Energy Solutions",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1851763",
        "website": "http://www.apexenergygroup.com",
        "geography": "Indianapolis, Indiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "213 employees on LinkedIn",
        "companyId": "1851763"
    },
    {
        "id": 611,
        "name": "AppliancesConnection",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2843147",
        "website": "http://www.appliancesconnection.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "2843147"
    },
    {
        "id": 612,
        "name": "Aqua Products Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=736652",
        "website": "https://aquaproducts.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "98 employees on LinkedIn",
        "companyId": "736652"
    },
    {
        "id": 613,
        "name": "Aquion, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=48249",
        "website": "http://www.aquion.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "48249"
    },
    {
        "id": 614,
        "name": "Ardisam, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=9290516",
        "website": "http://www.ardisam.com",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "79 employees on LinkedIn",
        "companyId": "9290516"
    },
    {
        "id": 615,
        "name": "Ariel Premium Supply",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=701821",
        "website": "http://www.ArielPremium.com",
        "geography": "Greater St. Louis Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "70 employees on LinkedIn",
        "companyId": "701821"
    },
    {
        "id": 616,
        "name": "Artistic Finishes",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=151443",
        "website": "https://www.artisticfinishes.com/",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "151443"
    },
    {
        "id": 617,
        "name": "ASR",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=162555",
        "website": "http://www.personna.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "302 employees on LinkedIn",
        "companyId": "162555"
    },
    {
        "id": 618,
        "name": "Atkins Nutritionals, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=375176",
        "website": "http://www.atkins.com",
        "geography": "Greater Denver Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "158 employees on LinkedIn",
        "companyId": "375176"
    },
    {
        "id": 619,
        "name": "Atomy Everyday Consumer Club",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3304854",
        "website": "http://www.atomyeveryday.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "106 employees on LinkedIn",
        "companyId": "3304854"
    },
    {
        "id": 620,
        "name": "Aurora Products, Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1177661",
        "website": "http://www.auroranatural.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "1177661"
    },
    {
        "id": 621,
        "name": "Aurora World, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=137668",
        "website": "http://www.auroragift.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "66 employees on LinkedIn",
        "companyId": "137668"
    },
    {
        "id": 622,
        "name": "Australian Gold, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1536604",
        "website": "http://www.australiangold.com",
        "geography": "Indianapolis, Indiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "79 employees on LinkedIn",
        "companyId": "1536604"
    },
    {
        "id": 623,
        "name": "Autonomous Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=7001946",
        "website": "https://www.autonomous.ai",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "158 employees on LinkedIn",
        "companyId": "7001946"
    },
    {
        "id": 624,
        "name": "Baby Trend, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=995247",
        "website": "http://www.BabyTrend.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "995247"
    },
    {
        "id": 625,
        "name": "Bakery Crafts",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=112078",
        "website": "http://www.bakerycrafts.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "159 employees on LinkedIn",
        "companyId": "112078"
    },
    {
        "id": 626,
        "name": "Bandai America",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=40140",
        "website": "http://www.bandai.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "116 employees on LinkedIn",
        "companyId": "40140"
    },
    {
        "id": 627,
        "name": "BARK",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3261463",
        "website": "http://bark.co/",
        "geography": "US",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "225 employees on LinkedIn",
        "companyId": "3261463"
    },
    {
        "id": 628,
        "name": "Basic Fun!",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=896333",
        "website": "http://www.basicfun.com",
        "geography": "West Palm Beach, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "896333"
    },
    {
        "id": 629,
        "name": "BBC International LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10023685",
        "website": "http://www.bbcint.com",
        "geography": "West Palm Beach, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "107 employees on LinkedIn",
        "companyId": "10023685"
    },
    {
        "id": 630,
        "name": "Beauty Industry Group",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3634434",
        "website": "http://beautyindustrygroup.com/",
        "geography": "Greater Salt Lake City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "3634434"
    },
    {
        "id": 631,
        "name": "Bendix Spicer Foundation Brake, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8026340",
        "website": "http://www.foundationbrakes.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "8026340"
    },
    {
        "id": 632,
        "name": "Betabrand",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1693405",
        "website": "http://www.betabrand.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "71 employees on LinkedIn",
        "companyId": "1693405"
    },
    {
        "id": 633,
        "name": "Big Time Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=435511",
        "website": "http://www.bigtimeproducts.net",
        "geography": "Greater Atlanta Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "87 employees on LinkedIn",
        "companyId": "435511"
    },
    {
        "id": 634,
        "name": "Bil-Jac",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1422435",
        "website": "http://www.bil-jac.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "1422435"
    },
    {
        "id": 635,
        "name": "BioLite",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2231227",
        "website": "https://www.bioliteenergy.com/pages/mission",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "70 employees on LinkedIn",
        "companyId": "2231227"
    },
    {
        "id": 636,
        "name": "Boosted, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3620632",
        "website": "http://www.BoostedBoards.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "88 employees on LinkedIn",
        "companyId": "3620632"
    },
    {
        "id": 637,
        "name": "Brandless, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=15257285",
        "website": "https://brndlss.life/join-brandless-life",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "15257285"
    },
    {
        "id": 638,
        "name": "Brenthaven",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=57913",
        "website": "http://www.brenthaven.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "57913"
    },
    {
        "id": 639,
        "name": "Bretford",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=62018",
        "website": "http://www.bretford.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "105 employees on LinkedIn",
        "companyId": "62018"
    },
    {
        "id": 640,
        "name": "Brewster Home Fashions",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2354948",
        "website": "http://www.brewsterwallcovering.com/",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "77 employees on LinkedIn",
        "companyId": "2354948"
    },
    {
        "id": 641,
        "name": "Brinly-Hardy Co.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=317350",
        "website": "http://www.brinly.com",
        "geography": "Louisville, Kentucky Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "67 employees on LinkedIn",
        "companyId": "317350"
    },
    {
        "id": 642,
        "name": "Brown",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=483541",
        "website": "http://www.brown-haley.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "78 employees on LinkedIn",
        "companyId": "483541"
    },
    {
        "id": 643,
        "name": "C-Care, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=943419",
        "website": "http://www.ccarellc.com",
        "geography": "Baltimore, Maryland Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "943419"
    },
    {
        "id": 644,
        "name": "CAA-GBG Global Brand Management Group",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=29975",
        "website": "http://www.caa-gbg.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "217 employees on LinkedIn",
        "companyId": "29975"
    },
    {
        "id": 645,
        "name": "Camelot Illinois",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=16189432",
        "website": "http://www.camelotillinois.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "16189432"
    },
    {
        "id": 646,
        "name": "CANIDAE Pet Foods",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2026174",
        "website": "https://www.canidae.com/",
        "geography": "San Luis Obispo, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "77 employees on LinkedIn",
        "companyId": "2026174"
    },
    {
        "id": 647,
        "name": "Capital Brands, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2129242",
        "website": "https://www.nutriliving.com/capitalbrands/",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "80 employees on LinkedIn",
        "companyId": "2129242"
    },
    {
        "id": 648,
        "name": "Capital Distributing",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5945678",
        "website": "http://WWW.CAPITALDISTRIBUTING.COM",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "5945678"
    },
    {
        "id": 649,
        "name": "Capital Office Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1540608",
        "website": "http://www.capofficeproducts.com",
        "geography": "Daytona Beach, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "78 employees on LinkedIn",
        "companyId": "1540608"
    },
    {
        "id": 650,
        "name": "Carlisle Wide Plank Floors",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=855825",
        "website": "http://www.wideplankflooring.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "67 employees on LinkedIn",
        "companyId": "855825"
    },
    {
        "id": 651,
        "name": "Carma Laboratories, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1224253",
        "website": "http://www.mycarmex.com",
        "geography": "Greater Milwaukee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "1224253"
    },
    {
        "id": 652,
        "name": "Carolina Pad",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=141672",
        "website": "http://www.carolinapad.com",
        "geography": "Charlotte, North Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "141672"
    },
    {
        "id": 653,
        "name": "Carreras Limited",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=4292884",
        "website": "http://www.carrerasltd.com/",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "4292884"
    },
    {
        "id": 654,
        "name": "Casabella",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=113147",
        "website": "http://www.casabella.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "112 employees on LinkedIn",
        "companyId": "113147"
    },
    {
        "id": 655,
        "name": "Case-Mate",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=141626",
        "website": "http://www.case-mate.com",
        "geography": "Greater Atlanta Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "90 employees on LinkedIn",
        "companyId": "141626"
    },
    {
        "id": 656,
        "name": "CCA Industries",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=79731",
        "website": "http://www.ccaindustries.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "284 employees on LinkedIn",
        "companyId": "79731"
    },
    {
        "id": 657,
        "name": "CCF Brands",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=111641",
        "website": "http://www.ccfbrands.com",
        "geography": "Fayetteville, Arkansas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "111641"
    },
    {
        "id": 658,
        "name": "Cedar Grove",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=747616",
        "website": "http://www.cedar-grove.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "747616"
    },
    {
        "id": 659,
        "name": "Celebrating Home Direct",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2604018",
        "website": "http://www.celebratinghomedirect.com",
        "geography": "Longview, Texas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "188 employees on LinkedIn",
        "companyId": "2604018"
    },
    {
        "id": 660,
        "name": "cfm Distributors,Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=925195",
        "website": "http://www.cfmdistributors.com",
        "geography": "Kansas City, Missouri Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "75 employees on LinkedIn",
        "companyId": "925195"
    },
    {
        "id": 661,
        "name": "ChemAid Laboratories, Inc., a KDC Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=862974",
        "website": "http://www.kdc-companies.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "862974"
    },
    {
        "id": 662,
        "name": "Chervon North America",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=507924",
        "website": "http://www.chervongroup.com/",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "129 employees on LinkedIn",
        "companyId": "507924"
    },
    {
        "id": 663,
        "name": "Cheryl's Cookies and Brownies",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=137284",
        "website": "http://www.cheryls.com",
        "geography": "Columbus, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "114 employees on LinkedIn",
        "companyId": "137284"
    },
    {
        "id": 664,
        "name": "Chinese Laundry",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1128277",
        "website": "http://www.chineselaundry.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "168 employees on LinkedIn",
        "companyId": "1128277"
    },
    {
        "id": 665,
        "name": "Clarion Industries",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=551917",
        "website": "http://www.clarionindustries.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "551917"
    },
    {
        "id": 666,
        "name": "CMC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3861431",
        "website": "http://www.cmcpro.com",
        "geography": "Santa Barbara, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "304 employees on LinkedIn",
        "companyId": "3861431"
    },
    {
        "id": 667,
        "name": "Colson Casters",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=396589",
        "website": "http://www.colsoncaster.com",
        "geography": "Jonesboro, Arkansas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "76 employees on LinkedIn",
        "companyId": "396589"
    },
    {
        "id": 668,
        "name": "Combi USA, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=136504",
        "website": "http://www.combiusa.com",
        "geography": "Charlotte, North Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "136504"
    },
    {
        "id": 669,
        "name": "Concept One Accessories",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1134263",
        "website": "http://www.concept1.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "79 employees on LinkedIn",
        "companyId": "1134263"
    },
    {
        "id": 670,
        "name": "Coravin",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3076113",
        "website": "http://www.coravin.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "112 employees on LinkedIn",
        "companyId": "3076113"
    },
    {
        "id": 671,
        "name": "Cosco Industries",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=51381",
        "website": "http://www.coscoindustries.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "162 employees on LinkedIn",
        "companyId": "51381"
    },
    {
        "id": 672,
        "name": "Cotopaxi - Gear for Good",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3493796",
        "website": "http://www.cotopaxi.com",
        "geography": "Greater Salt Lake City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "3493796"
    },
    {
        "id": 673,
        "name": "Cousin Corporation of America",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1357703",
        "website": "http://www.cousin.com",
        "geography": "Tampa/St. Petersburg, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "67 employees on LinkedIn",
        "companyId": "1357703"
    },
    {
        "id": 674,
        "name": "Cranium",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=12136",
        "website": "http://www.wetpaint.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "12136"
    },
    {
        "id": 675,
        "name": "Crimzon Rose International",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1140844",
        "website": "http://www.crimzonrose.com",
        "geography": "Providence, Rhode Island Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "1140844"
    },
    {
        "id": 676,
        "name": "Crown Crafts, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=99752",
        "website": "http://www.crowncrafts.com",
        "geography": "Baton Rouge, Louisiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "99752"
    },
    {
        "id": 677,
        "name": "CTI Industries Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2093125",
        "website": "http://www.ctiindustries.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "70 employees on LinkedIn",
        "companyId": "2093125"
    },
    {
        "id": 678,
        "name": "Curtis Industries, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=99810",
        "website": "http://www.curtiscab.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "66 employees on LinkedIn",
        "companyId": "99810"
    },
    {
        "id": 679,
        "name": "CUTCO Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=6062521",
        "website": "http://www.alcas.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "133 employees on LinkedIn",
        "companyId": "6062521"
    },
    {
        "id": 680,
        "name": "Cyanotech Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5506323",
        "website": "http://cyanotech.com",
        "geography": "Hawaiian Islands",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "5506323"
    },
    {
        "id": 681,
        "name": "Darex, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1420687",
        "website": "http://www.darex.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "1420687"
    },
    {
        "id": 682,
        "name": "De Rigo REM",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=106907",
        "website": "http://www.derigo.us",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "116 employees on LinkedIn",
        "companyId": "106907"
    },
    {
        "id": 683,
        "name": "DEMDACO",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=489806",
        "website": "http://www.DEMDACO.com",
        "geography": "Kansas City, Missouri Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "217 employees on LinkedIn",
        "companyId": "489806"
    },
    {
        "id": 684,
        "name": "DenTek Oral Care, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=142153",
        "website": "http://www.dentek.com",
        "geography": "Knoxville, Tennessee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "142153"
    },
    {
        "id": 685,
        "name": "Department 56",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8263",
        "website": "https://www.department56.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "80 employees on LinkedIn",
        "companyId": "8263"
    },
    {
        "id": 686,
        "name": "Dermstore",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1287044",
        "website": "https://www.dermstore.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "111 employees on LinkedIn",
        "companyId": "1287044"
    },
    {
        "id": 687,
        "name": "Design Design",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=142221",
        "website": "http://www.designdesign.us",
        "geography": "Greater Grand Rapids, Michigan Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "104 employees on LinkedIn",
        "companyId": "142221"
    },
    {
        "id": 688,
        "name": "Design Imports",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=758425",
        "website": "http://www.designimports.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "758425"
    },
    {
        "id": 689,
        "name": "Designer Greetings",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=417713",
        "website": "http://designergreetings.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "130 employees on LinkedIn",
        "companyId": "417713"
    },
    {
        "id": 690,
        "name": "DHI Corp (Design House)",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=425368",
        "website": "http://www.todaysdesignhouse.com",
        "geography": "Greater Milwaukee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "425368"
    },
    {
        "id": 691,
        "name": "Diono",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=812543",
        "website": "https://www.diono.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "84 employees on LinkedIn",
        "companyId": "812543"
    },
    {
        "id": 692,
        "name": "Dixie Chopper",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=318343",
        "website": "http://www.dixiechopper.com",
        "geography": "Indianapolis, Indiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "318343"
    },
    {
        "id": 693,
        "name": "Dixon Ticonderoga",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=426405",
        "website": "http://www.dixonusa.com",
        "geography": "Orlando, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "127 employees on LinkedIn",
        "companyId": "426405"
    },
    {
        "id": 694,
        "name": "Dr. Bronner's",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=4866989",
        "website": "http://www.drbronner.com",
        "geography": "Greater San Diego Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "104 employees on LinkedIn",
        "companyId": "4866989"
    },
    {
        "id": 695,
        "name": "DRAGON ALLIANCE",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=283287",
        "website": "http://www.dragonalliance.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "82 employees on LinkedIn",
        "companyId": "283287"
    },
    {
        "id": 696,
        "name": "DS LABORATORIES",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2732170",
        "website": "http://www.dslaboratories.com",
        "geography": "Miami/Fort Lauderdale Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "2732170"
    },
    {
        "id": 697,
        "name": "Duraflame, Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=152363",
        "website": "http://www.duraflame.com",
        "geography": "Stockton, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "63 employees on LinkedIn",
        "companyId": "152363"
    },
    {
        "id": 698,
        "name": "Eagle Creek",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3175856",
        "website": "http://www.eaglecreek.com",
        "geography": "Greater San Diego Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "3175856"
    },
    {
        "id": 699,
        "name": "Earth Shoes",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2033828",
        "website": "http://www.earthbrands.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "2033828"
    },
    {
        "id": 700,
        "name": "East Bay Tire Co",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=4034599",
        "website": "http://www.eastbaytire.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "4034599"
    },
    {
        "id": 701,
        "name": "ELECTRIC ⚡️",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=224324",
        "website": "http://www.electriccalifornia.com",
        "geography": "Orange County, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "233 employees on LinkedIn",
        "companyId": "224324"
    },
    {
        "id": 702,
        "name": "Ellery Homestyles LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1024432",
        "website": "http://www.elleryhomestyles.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "150 employees on LinkedIn",
        "companyId": "1024432"
    },
    {
        "id": 703,
        "name": "Enerco Group Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2775465",
        "website": "http://www.mrheater.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "84 employees on LinkedIn",
        "companyId": "2775465"
    },
    {
        "id": 704,
        "name": "Enertech Global, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2748250",
        "website": "http://www.enertechgeo.com",
        "geography": "Greater St. Louis Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "2748250"
    },
    {
        "id": 705,
        "name": "Environmental Lights",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1124594",
        "website": "http://www.EnvironmentalLights.com",
        "geography": "Greater San Diego Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "1124594"
    },
    {
        "id": 706,
        "name": "EO Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1785641",
        "website": "http://www.eoproducts.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "1785641"
    },
    {
        "id": 707,
        "name": "eos Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1903142",
        "website": "http://www.evolutionofsmooth.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "84 employees on LinkedIn",
        "companyId": "1903142"
    },
    {
        "id": 708,
        "name": "eReplacementParts.com",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1017639",
        "website": "http://www.ereplacementparts.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "70 employees on LinkedIn",
        "companyId": "1017639"
    },
    {
        "id": 709,
        "name": "Ergobaby",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=629524",
        "website": "http://www.ergobaby.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "118 employees on LinkedIn",
        "companyId": "629524"
    },
    {
        "id": 710,
        "name": "ET Browne Drug Co. Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1631016",
        "website": "http://www.palmers.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "78 employees on LinkedIn",
        "companyId": "1631016"
    },
    {
        "id": 711,
        "name": "Etekcity",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3374179",
        "website": "http://www.etekcity.com",
        "geography": "Orange County, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "59 employees on LinkedIn",
        "companyId": "3374179"
    },
    {
        "id": 712,
        "name": "Evolution Lighting, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1285389",
        "website": "http://evolutionlightingllc.com",
        "geography": "Miami/Fort Lauderdale Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "1285389"
    },
    {
        "id": 713,
        "name": "EZ-ACCESS",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=876616",
        "website": "http://www.ezaccess.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "77 employees on LinkedIn",
        "companyId": "876616"
    },
    {
        "id": 714,
        "name": "Factory Builder Stores",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=401379",
        "website": "http://www.factorybuilderstores.com/",
        "geography": "Houston, Texas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "117 employees on LinkedIn",
        "companyId": "401379"
    },
    {
        "id": 715,
        "name": "Fashion Angels",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3182851",
        "website": "http://www.FashionAngels.com",
        "geography": "Greater Milwaukee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "83 employees on LinkedIn",
        "companyId": "3182851"
    },
    {
        "id": 716,
        "name": "Fasteners Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2625910",
        "website": "http://www.fastenersincmi.com",
        "geography": "Greater Grand Rapids, Michigan Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "2625910"
    },
    {
        "id": 717,
        "name": "Fathead",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=206424",
        "website": "http://www.fathead.com",
        "geography": "Greater Detroit Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "84 employees on LinkedIn",
        "companyId": "206424"
    },
    {
        "id": 718,
        "name": "Faultless Starch/Bon Ami Co.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=100819",
        "website": "http://www.faultless.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "100819"
    },
    {
        "id": 719,
        "name": "Feit Electric",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=586826",
        "website": "http://www.feit.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "78 employees on LinkedIn",
        "companyId": "586826"
    },
    {
        "id": 720,
        "name": "Fetch ... for pets!",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=887842",
        "website": "http://www.fetch4pets.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "887842"
    },
    {
        "id": 721,
        "name": "Filament Brands",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=17964766",
        "website": "https://www.filamentbrands.com/",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "17964766"
    },
    {
        "id": 722,
        "name": "firstSTREET for Boomers",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=110189",
        "website": "http://www.firststreetonline.com",
        "geography": "Richmond, Virginia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "97 employees on LinkedIn",
        "companyId": "110189"
    },
    {
        "id": 723,
        "name": "FKC International Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1387529",
        "website": "http://www.fkcn.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "167 employees on LinkedIn",
        "companyId": "1387529"
    },
    {
        "id": 724,
        "name": "Focus Products Group International, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=313423",
        "website": "http://www.focuspg.com/",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "88 employees on LinkedIn",
        "companyId": "313423"
    },
    {
        "id": 725,
        "name": "Fox Run Brands",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1048825",
        "website": "http://www.foxrunbrands.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "1048825"
    },
    {
        "id": 726,
        "name": "Frank B Fuhrer Wholesale Co",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8498584",
        "website": "http://www.fuhrerwholesale.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "77 employees on LinkedIn",
        "companyId": "8498584"
    },
    {
        "id": 727,
        "name": "Freshpet",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2389955",
        "website": "http://freshpet.com/",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "129 employees on LinkedIn",
        "companyId": "2389955"
    },
    {
        "id": 728,
        "name": "From You Flowers",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=278443",
        "website": "http://www.fromyouflowers.com",
        "geography": "New London/Norwich, Connecticut Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "278443"
    },
    {
        "id": 729,
        "name": "Fujitsu General America, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1846710",
        "website": "http://www.fujitsugeneral.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "1846710"
    },
    {
        "id": 730,
        "name": "Fully (formerly Ergo Depot)",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2623237",
        "website": "http://www.fully.com",
        "geography": "Portland, Oregon Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "2623237"
    },
    {
        "id": 731,
        "name": "Funrise",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=90663",
        "website": "http://www.funrise.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "90663"
    },
    {
        "id": 732,
        "name": "G-Form",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2263117",
        "website": "http://www.g-form.com",
        "geography": "Providence, Rhode Island Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "59 employees on LinkedIn",
        "companyId": "2263117"
    },
    {
        "id": 733,
        "name": "Galerie Candy and Gifts",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=46713",
        "website": "http://www.galeriecandy.com",
        "geography": "Cincinnati, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "216 employees on LinkedIn",
        "companyId": "46713"
    },
    {
        "id": 734,
        "name": "Gartner Studios",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=63550",
        "website": "http://www.gartnerstudios.com",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "88 employees on LinkedIn",
        "companyId": "63550"
    },
    {
        "id": 735,
        "name": "GBS Enterprises",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=511682",
        "website": "http://www.gbsent.com",
        "geography": "Reno, Nevada Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "511682"
    },
    {
        "id": 736,
        "name": "Gemmy Industries Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=49207",
        "website": "http://www.gemmy.com",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "102 employees on LinkedIn",
        "companyId": "49207"
    },
    {
        "id": 737,
        "name": "Gems Group, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1470505",
        "website": "http://www.TheGemsGroup.com",
        "geography": "Miami/Fort Lauderdale Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "1470505"
    },
    {
        "id": 738,
        "name": "General Tools",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5060485",
        "website": "http://www.generaltools.com/",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "5060485"
    },
    {
        "id": 739,
        "name": "GHP Group, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1228920",
        "website": "http://www.ghpgroupinc.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "97 employees on LinkedIn",
        "companyId": "1228920"
    },
    {
        "id": 740,
        "name": "Ginsey Home Solutions",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1038080",
        "website": "http://www.ginsey.com/",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "1038080"
    },
    {
        "id": 741,
        "name": "Glossier, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=9217565",
        "website": "http://glossier.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "386 employees on LinkedIn",
        "companyId": "9217565"
    },
    {
        "id": 742,
        "name": "GMPC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=91076",
        "website": "http://www.gmpc.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "109 employees on LinkedIn",
        "companyId": "91076"
    },
    {
        "id": 743,
        "name": "GOAL ZERO",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1036385",
        "website": "http://www.goalzero.com",
        "geography": "Greater Salt Lake City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "111 employees on LinkedIn",
        "companyId": "1036385"
    },
    {
        "id": 744,
        "name": "Golden Eagle Distributing Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1242773",
        "website": "http://www.goldeneagledist.com",
        "geography": "Sacramento, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "74 employees on LinkedIn",
        "companyId": "1242773"
    },
    {
        "id": 745,
        "name": "Grandex Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2867972",
        "website": "http://grandex.co",
        "geography": "Austin, Texas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "2867972"
    },
    {
        "id": 746,
        "name": "Graphik Dimensions Ltd.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=75040",
        "website": "http://www.pictureframes.com",
        "geography": "Greensboro/Winston-Salem, North Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "79 employees on LinkedIn",
        "companyId": "75040"
    },
    {
        "id": 747,
        "name": "Green Tokai Co. Ltd.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8879741",
        "website": "http://www.greentokai.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "132 employees on LinkedIn",
        "companyId": "8879741"
    },
    {
        "id": 748,
        "name": "Greenlane, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2771534",
        "website": "http://gnln.com",
        "geography": "West Palm Beach, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "2771534"
    },
    {
        "id": 749,
        "name": "GUND",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5207968",
        "website": "http://www.gund.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "5207968"
    },
    {
        "id": 750,
        "name": "Hampton Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=102673",
        "website": "http://www.hamptonproducts.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "102 employees on LinkedIn",
        "companyId": "102673"
    },
    {
        "id": 751,
        "name": "Handi Quilter, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=971470",
        "website": "http://www.handiquilter.com/",
        "geography": "Greater Salt Lake City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "66 employees on LinkedIn",
        "companyId": "971470"
    },
    {
        "id": 752,
        "name": "Handi-Craft Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=657255",
        "website": "https://www.drbrownsbaby.com/",
        "geography": "Greater St. Louis Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "83 employees on LinkedIn",
        "companyId": "657255"
    },
    {
        "id": 753,
        "name": "Hartmann",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=917717",
        "website": "http://hartmann.com",
        "geography": "Greater Nashville Area, TN",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "128 employees on LinkedIn",
        "companyId": "917717"
    },
    {
        "id": 754,
        "name": "Healthy Pet",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1467975",
        "website": "http://www.healthy-pet.com",
        "geography": "Bellingham, Washington Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "69 employees on LinkedIn",
        "companyId": "1467975"
    },
    {
        "id": 755,
        "name": "Helmet House, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=528487",
        "website": "http://www.helmethouse.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "528487"
    },
    {
        "id": 756,
        "name": "HexArmor",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=587343",
        "website": "http://www.hexarmor.com",
        "geography": "Greater Grand Rapids, Michigan Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "103 employees on LinkedIn",
        "companyId": "587343"
    },
    {
        "id": 757,
        "name": "High Ridge Brands",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1663520",
        "website": "http://www.highridgebrands.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "84 employees on LinkedIn",
        "companyId": "1663520"
    },
    {
        "id": 758,
        "name": "HMS Mfg. Co.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=403839",
        "website": "http://www.hmsmfg.com",
        "geography": "Greater Detroit Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "75 employees on LinkedIn",
        "companyId": "403839"
    },
    {
        "id": 759,
        "name": "Honest Tea",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=34064",
        "website": "http://www.honesttea.com",
        "geography": "Washington D.C. Metro Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "105 employees on LinkedIn",
        "companyId": "34064"
    },
    {
        "id": 760,
        "name": "Honey-Can-Do International LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=707559",
        "website": "http://www.honeycando.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "76 employees on LinkedIn",
        "companyId": "707559"
    },
    {
        "id": 761,
        "name": "HTP Comfort Solutions LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=696935",
        "website": "http://www.htproducts.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "82 employees on LinkedIn",
        "companyId": "696935"
    },
    {
        "id": 762,
        "name": "Hunter Fan Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=23484",
        "website": "http://www.hunterfan.com",
        "geography": "Greater Memphis Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "194 employees on LinkedIn",
        "companyId": "23484"
    },
    {
        "id": 763,
        "name": "Hy-Ko Products Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=406137",
        "website": "http://hy-ko.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "88 employees on LinkedIn",
        "companyId": "406137"
    },
    {
        "id": 764,
        "name": "Hydro Flask",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=810874",
        "website": "http://www.HydroFlask.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "86 employees on LinkedIn",
        "companyId": "810874"
    },
    {
        "id": 765,
        "name": "HySecurity / Nice USA Gate Operators",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1258396",
        "website": "http://www.hysecurity.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "1258396"
    },
    {
        "id": 766,
        "name": "i-Health, Inc., a Division of DSM",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=15711550",
        "website": "http://dsmihealth.com",
        "geography": "Hartford, Connecticut Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "15711550"
    },
    {
        "id": 767,
        "name": "Incase",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=712414",
        "website": "https://incase.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "712414"
    },
    {
        "id": 768,
        "name": "Infantino",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=91538",
        "website": "http://www.infantino.com",
        "geography": "Greater San Diego Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "76 employees on LinkedIn",
        "companyId": "91538"
    },
    {
        "id": 769,
        "name": "Initials, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2922156",
        "website": "http://www.initials-inc.com",
        "geography": "Greenville, South Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "245 employees on LinkedIn",
        "companyId": "2922156"
    },
    {
        "id": 770,
        "name": "Innovative Skincare",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=683780",
        "website": "http://www.isclinical.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "683780"
    },
    {
        "id": 771,
        "name": "Jacobs",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=466783",
        "website": "http://jacobsmarketing.com/",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "466783"
    },
    {
        "id": 772,
        "name": "Jada Toys",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=83142",
        "website": "http://www.jadatoys.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "63 employees on LinkedIn",
        "companyId": "83142"
    },
    {
        "id": 773,
        "name": "Jamak Fabrication",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=145127",
        "website": "http://www.jamak.com",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "145127"
    },
    {
        "id": 774,
        "name": "Jay Franco and Sons Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=144103",
        "website": "https://www.jfranco.com/",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "144103"
    },
    {
        "id": 775,
        "name": "Jazwares, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3109444",
        "website": "http://www.jazwares.com",
        "geography": "Miami/Fort Lauderdale Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "146 employees on LinkedIn",
        "companyId": "3109444"
    },
    {
        "id": 776,
        "name": "JB Industries",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2692110",
        "website": "http://www.jbind.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "91 employees on LinkedIn",
        "companyId": "2692110"
    },
    {
        "id": 777,
        "name": "JD Beauty Group / Wet Brush",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3012770",
        "website": "http://www.thewetbrush.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "3012770"
    },
    {
        "id": 778,
        "name": "Jeffers",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1008578",
        "website": "https://www.jefferspet.com",
        "geography": "Dothan, Alabama Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "1008578"
    },
    {
        "id": 779,
        "name": "Just Funky",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10507072",
        "website": "http://justfunky.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "10507072"
    },
    {
        "id": 780,
        "name": "K'NEX L.P.G.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=69212",
        "website": "http://www.knex.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "69212"
    },
    {
        "id": 781,
        "name": "Kahn Lucas",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=450093",
        "website": "http://www.kahnlucas.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "86 employees on LinkedIn",
        "companyId": "450093"
    },
    {
        "id": 782,
        "name": "Kaz USA, Inc. a Helen of Troy Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2799530",
        "website": "http://www.kaz.com/kaz/company-overview/",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "90 employees on LinkedIn",
        "companyId": "2799530"
    },
    {
        "id": 783,
        "name": "Keen Compressed Gas Co.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2158489",
        "website": "http://www.keengas.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "2158489"
    },
    {
        "id": 784,
        "name": "Kellogg Garden Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=552389",
        "website": "http://www.kellogggarden.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "552389"
    },
    {
        "id": 785,
        "name": "Kenra Professional",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1262561",
        "website": "http://www.kenraprofessional.com",
        "geography": "Indianapolis, Indiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "86 employees on LinkedIn",
        "companyId": "1262561"
    },
    {
        "id": 786,
        "name": "Kerusso Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=610371",
        "website": "http://www.kerusso.com",
        "geography": "Fayetteville, Arkansas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "610371"
    },
    {
        "id": 787,
        "name": "KEVIN.MURPHY",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=6451216",
        "website": "http://www.kevinmurphy.com.au",
        "geography": "Orange County, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "162 employees on LinkedIn",
        "companyId": "6451216"
    },
    {
        "id": 788,
        "name": "Kipper Tool Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1167319",
        "website": "http://www.kippertool.com",
        "geography": "Greater Atlanta Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "1167319"
    },
    {
        "id": 789,
        "name": "KONG Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=116859",
        "website": "http://www.kongcompany.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "134 employees on LinkedIn",
        "companyId": "116859"
    },
    {
        "id": 790,
        "name": "Koval Williamson",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2186166",
        "website": "http://www.kwawest.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "53 employees on LinkedIn",
        "companyId": "2186166"
    },
    {
        "id": 791,
        "name": "Kraus, USA",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2446269",
        "website": "http://www.kraususa.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "2446269"
    },
    {
        "id": 792,
        "name": "Kurtz Bros., Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=153457",
        "website": "http://www.kurtz-bros.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "153457"
    },
    {
        "id": 793,
        "name": "Kuryakyn",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2487121",
        "website": "http://www.Kuryakyn.com",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "2487121"
    },
    {
        "id": 794,
        "name": "L'ANZA Healing Haircare / DAVEXLABS LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=152062",
        "website": "https://lanza.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "84 employees on LinkedIn",
        "companyId": "152062"
    },
    {
        "id": 795,
        "name": "L'dara",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3999235",
        "website": "http://www.ldara.com",
        "geography": "Phoenix, Arizona Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "3999235"
    },
    {
        "id": 796,
        "name": "Lamplight Farms Incorporated",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1444146",
        "website": "http://www.tikibrand.com",
        "geography": "Greater Milwaukee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "1444146"
    },
    {
        "id": 797,
        "name": "Lansinoh Laboratories",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=343093",
        "website": "http://www.lansinoh.com",
        "geography": "Washington D.C. Metro Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "343093"
    },
    {
        "id": 798,
        "name": "Lapine Associates",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=133332",
        "website": "http://www.lapineinc.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "91 employees on LinkedIn",
        "companyId": "133332"
    },
    {
        "id": 799,
        "name": "Learning Resources",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=30290",
        "website": "http://www.learningresources.com/",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "172 employees on LinkedIn",
        "companyId": "30290"
    },
    {
        "id": 800,
        "name": "Lil' Drug Store Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=145713",
        "website": "http://www.lildrugstore.com/",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "74 employees on LinkedIn",
        "companyId": "145713"
    },
    {
        "id": 801,
        "name": "LINE-X LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1210481",
        "website": "http://www.linex.com",
        "geography": "Huntsville, Alabama Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "235 employees on LinkedIn",
        "companyId": "1210481"
    },
    {
        "id": 802,
        "name": "Lion Brand Yarn Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=209170",
        "website": "http://www.lionbrand.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "209170"
    },
    {
        "id": 803,
        "name": "Lionel LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=118928",
        "website": "http://www.lionel.com",
        "geography": "Greater Detroit Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "131 employees on LinkedIn",
        "companyId": "118928"
    },
    {
        "id": 804,
        "name": "Local Motors",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=722441",
        "website": "https://localmotors.com/",
        "geography": "Phoenix, Arizona Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "147 employees on LinkedIn",
        "companyId": "722441"
    },
    {
        "id": 805,
        "name": "Lucerne Foods",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1096444",
        "website": "http://www.lucernefoods.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "1096444"
    },
    {
        "id": 806,
        "name": "Mace Security International",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=244469",
        "website": "http://www.mace.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "143 employees on LinkedIn",
        "companyId": "244469"
    },
    {
        "id": 807,
        "name": "Made For Retail Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=9350476",
        "website": "http://www.madeforretail.com",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "9350476"
    },
    {
        "id": 808,
        "name": "Mapa Spontex Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=215133",
        "website": "http://www.spontexusa.com",
        "geography": "Greater Nashville Area, TN",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "83 employees on LinkedIn",
        "companyId": "215133"
    },
    {
        "id": 809,
        "name": "Marketing Management Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=327745",
        "website": "http://www.mmibrands.com/",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "107 employees on LinkedIn",
        "companyId": "327745"
    },
    {
        "id": 810,
        "name": "Mars, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=869558",
        "website": "http://www.mars.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "430 employees on LinkedIn",
        "companyId": "869558"
    },
    {
        "id": 811,
        "name": "Marshall Associates Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=42806",
        "website": "http://www.marshassoc.com/",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "170 employees on LinkedIn",
        "companyId": "42806"
    },
    {
        "id": 812,
        "name": "Master Magnetics",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=561082",
        "website": "http://www.magnetsource.com",
        "geography": "Greater Denver Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "561082"
    },
    {
        "id": 813,
        "name": "Masterbuilt Manufacturing",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=584743",
        "website": "http://www.masterbuilt.com",
        "geography": "Columbus, Georgia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "98 employees on LinkedIn",
        "companyId": "584743"
    },
    {
        "id": 814,
        "name": "Mattress By Appointment",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=4807074",
        "website": "https://mattressbyappointmentcareers.com",
        "geography": "Greenville, South Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "4807074"
    },
    {
        "id": 815,
        "name": "Max International LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=332209",
        "website": "http://www.maxinternational.com",
        "geography": "Greater Salt Lake City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "195 employees on LinkedIn",
        "companyId": "332209"
    },
    {
        "id": 816,
        "name": "McKay Nursery Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=834678",
        "website": "http://www.mckaynursery.com",
        "geography": "Madison, Wisconsin Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "834678"
    },
    {
        "id": 817,
        "name": "Mechanix Wear",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=131342",
        "website": "http://www.mechanix.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "90 employees on LinkedIn",
        "companyId": "131342"
    },
    {
        "id": 818,
        "name": "MECO",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=59903",
        "website": "http://www.mecomanufacturing.com/",
        "geography": "Johnson City, Tennessee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "181 employees on LinkedIn",
        "companyId": "59903"
    },
    {
        "id": 819,
        "name": "Melitta North America",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=18944",
        "website": "http://www.melitta.com",
        "geography": "Tampa/St. Petersburg, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "142 employees on LinkedIn",
        "companyId": "18944"
    },
    {
        "id": 820,
        "name": "MerchSource",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=118710",
        "website": "http://www.merchsource.com/",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "97 employees on LinkedIn",
        "companyId": "118710"
    },
    {
        "id": 821,
        "name": "Mermet Corp.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1135248",
        "website": "http://www.mermetusa.com",
        "geography": "Greenville, South Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "1135248"
    },
    {
        "id": 822,
        "name": "Merola Sales Company, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=685629",
        "website": "http://merolatile.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "685629"
    },
    {
        "id": 823,
        "name": "MFS Supply",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=440440",
        "website": "http://www.mfssupply.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "91 employees on LinkedIn",
        "companyId": "440440"
    },
    {
        "id": 824,
        "name": "Midway Importing, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1278617",
        "website": "http://www.midwayimporting.com",
        "geography": "Houston, Texas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "1278617"
    },
    {
        "id": 825,
        "name": "Midwest Dairy",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1244562",
        "website": "http://www.midwestdairy.com",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "89 employees on LinkedIn",
        "companyId": "1244562"
    },
    {
        "id": 826,
        "name": "Million Dollar Baby Co.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=267376",
        "website": "https://milliondollarbabyco.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "267376"
    },
    {
        "id": 827,
        "name": "MJ Holding Company, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=45929",
        "website": "http://www.mjholding.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "77 employees on LinkedIn",
        "companyId": "45929"
    },
    {
        "id": 828,
        "name": "Montana Silversmiths",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1430570",
        "website": "http://www.montanasilversmiths.com",
        "geography": "Billings, Montana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "75 employees on LinkedIn",
        "companyId": "1430570"
    },
    {
        "id": 829,
        "name": "Nancy's Notions",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=154119",
        "website": "http://www.nancysnotions.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "154119"
    },
    {
        "id": 830,
        "name": "Native Sun Natural Foods Market",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1042100",
        "website": "http://www.nativesunjax.com",
        "geography": "Jacksonville, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "1042100"
    },
    {
        "id": 831,
        "name": "Navien, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=456973",
        "website": "http://us.navien.com",
        "geography": "Orange County, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "121 employees on LinkedIn",
        "companyId": "456973"
    },
    {
        "id": 832,
        "name": "NEST Fragrances",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1085501",
        "website": "http://www.nestfragrances.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "63 employees on LinkedIn",
        "companyId": "1085501"
    },
    {
        "id": 833,
        "name": "Netafim USA",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=200841",
        "website": "http://www.netafimusa.com",
        "geography": "Fresno, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "157 employees on LinkedIn",
        "companyId": "200841"
    },
    {
        "id": 834,
        "name": "Niagara Conservation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=345400",
        "website": "http://niagaracorp.com/",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "98 employees on LinkedIn",
        "companyId": "345400"
    },
    {
        "id": 835,
        "name": "Nicopure Labs",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3082320",
        "website": "https://nicopure.com",
        "geography": "Tampa/St. Petersburg, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "71 employees on LinkedIn",
        "companyId": "3082320"
    },
    {
        "id": 836,
        "name": "Nixon",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=64670",
        "website": "http://nixon.com",
        "geography": "Greater San Diego Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "350 employees on LinkedIn",
        "companyId": "64670"
    },
    {
        "id": 837,
        "name": "NuStep, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=130481",
        "website": "https://www.nustep.com",
        "geography": "Greater Detroit Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "67 employees on LinkedIn",
        "companyId": "130481"
    },
    {
        "id": 838,
        "name": "Nylabone",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=839403",
        "website": "http://www.nylabone.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "69 employees on LinkedIn",
        "companyId": "839403"
    },
    {
        "id": 839,
        "name": "OakCraft, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1069001",
        "website": "http://www.oakcraft.com/",
        "geography": "Phoenix, Arizona Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "1069001"
    },
    {
        "id": 840,
        "name": "Oil City Area School District",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=4006756",
        "website": "http://www.ocasd.org",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "74 employees on LinkedIn",
        "companyId": "4006756"
    },
    {
        "id": 841,
        "name": "One Step Ahead",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=80228",
        "website": "http://www.onestepahead.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "92 employees on LinkedIn",
        "companyId": "80228"
    },
    {
        "id": 842,
        "name": "oneCARE",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=26861",
        "website": "http://www.onecareco.com",
        "geography": "Greater Atlanta Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "349 employees on LinkedIn",
        "companyId": "26861"
    },
    {
        "id": 843,
        "name": "Organa Brands",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3528756",
        "website": "http://www.organabrands.com",
        "geography": "Greater Denver Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "3528756"
    },
    {
        "id": 844,
        "name": "Oribe Hair Care",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1163728",
        "website": "http://www.oribe.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "106 employees on LinkedIn",
        "companyId": "1163728"
    },
    {
        "id": 845,
        "name": "Otis Technology",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1136682",
        "website": "http://www.otistec.com",
        "geography": "Utica, New York Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "1136682"
    },
    {
        "id": 846,
        "name": "Outlook Nebraska",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3551615",
        "website": "http://www.outlooknebraska.org",
        "geography": "Greater Omaha Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "3551615"
    },
    {
        "id": 847,
        "name": "OXO",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=200573",
        "website": "http://www.oxo.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "198 employees on LinkedIn",
        "companyId": "200573"
    },
    {
        "id": 848,
        "name": "Pacifica",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=890029",
        "website": "http://www.pacifica-intl.com",
        "geography": "Portland, Oregon Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "890029"
    },
    {
        "id": 849,
        "name": "Paris Presents Incorporated",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=120564",
        "website": "http://www.parispresents.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "144 employees on LinkedIn",
        "companyId": "120564"
    },
    {
        "id": 850,
        "name": "PDC BRANDS",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=84596",
        "website": "http://www.pdcbrandsusa.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "102 employees on LinkedIn",
        "companyId": "84596"
    },
    {
        "id": 851,
        "name": "Pepper Palace, Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3202223",
        "website": "http://www.pepperpalace.com",
        "geography": "Knoxville, Tennessee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "3202223"
    },
    {
        "id": 852,
        "name": "Pepsi-Cola Bottling Company of Northeast Wisconsin",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10051617",
        "website": "http://www.pepsinew.com",
        "geography": "Green Bay, Wisconsin Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "88 employees on LinkedIn",
        "companyId": "10051617"
    },
    {
        "id": 853,
        "name": "Perfection Pet Foods",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2193617",
        "website": "http://www.perfectionpetfoods.com",
        "geography": "Visalia, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "51 employees on LinkedIn",
        "companyId": "2193617"
    },
    {
        "id": 854,
        "name": "Pet Wants",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=9544873",
        "website": "http://www.petwantsfranchise.com",
        "geography": "Cincinnati, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "59 employees on LinkedIn",
        "companyId": "9544873"
    },
    {
        "id": 855,
        "name": "Pharmasol Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=131006",
        "website": "http://www.pharmasol.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "131006"
    },
    {
        "id": 856,
        "name": "Playmates Toys Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=70055",
        "website": "http://www.playmatestoys.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "63 employees on LinkedIn",
        "companyId": "70055"
    },
    {
        "id": 857,
        "name": "Poo~Pourri",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3185884",
        "website": "http://poopourri.com/",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "105 employees on LinkedIn",
        "companyId": "3185884"
    },
    {
        "id": 858,
        "name": "Portacool, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1034016",
        "website": "http://www.portacool.com",
        "geography": "Shreveport, Louisiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "120 employees on LinkedIn",
        "companyId": "1034016"
    },
    {
        "id": 859,
        "name": "Portland Glass",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=341708",
        "website": "http://www.portlandglass.com",
        "geography": "Portland, Maine Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "341708"
    },
    {
        "id": 860,
        "name": "Potandon Produce L.L.C.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=775848",
        "website": "http://www.potandon.com/",
        "geography": "Pocatello, Idaho Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "775848"
    },
    {
        "id": 861,
        "name": "Precious Moments",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=93703",
        "website": "http://www.preciousmoments.com",
        "geography": "Joplin, Missouri Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "126 employees on LinkedIn",
        "companyId": "93703"
    },
    {
        "id": 862,
        "name": "Premier Beauty Supply",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2407899",
        "website": "http://premierbeautysupply.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "78 employees on LinkedIn",
        "companyId": "2407899"
    },
    {
        "id": 863,
        "name": "Premier Brands of America Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1611941",
        "website": "http://www.premier-brands.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "1611941"
    },
    {
        "id": 864,
        "name": "Premier Nutrition: The Good Energy People",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=84201",
        "website": "http://www.premiernutrition.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "132 employees on LinkedIn",
        "companyId": "84201"
    },
    {
        "id": 865,
        "name": "Presence From Innovation (PFI)",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=550861",
        "website": "http://www.pfinnovation.com",
        "geography": "Greater St. Louis Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "59 employees on LinkedIn",
        "companyId": "550861"
    },
    {
        "id": 866,
        "name": "Princess House",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=27125",
        "website": "http://www.princesshouse.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "615 employees on LinkedIn",
        "companyId": "27125"
    },
    {
        "id": 867,
        "name": "Prizer Painter Stove Works",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=628629",
        "website": "http://www.bluestarcooking.com",
        "geography": "Reading, Pennsylvania Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "628629"
    },
    {
        "id": 868,
        "name": "Progressive International",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=65385",
        "website": "http://www.ProgressiveIntl.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "66 employees on LinkedIn",
        "companyId": "65385"
    },
    {
        "id": 869,
        "name": "Protect Plus LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=9732032",
        "website": "http://www.protectplus.com",
        "geography": "Hickory/Lenoir, North Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "9732032"
    },
    {
        "id": 870,
        "name": "Prudent Publishing",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1473942",
        "website": "http://www.gallerycollection.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "85 employees on LinkedIn",
        "companyId": "1473942"
    },
    {
        "id": 871,
        "name": "Publisher Services, Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=626740",
        "website": "http://www.pubservinc.com",
        "geography": "Greater Atlanta Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "626740"
    },
    {
        "id": 872,
        "name": "Punch Studio",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2356368",
        "website": "http://www.punchstudio.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "95 employees on LinkedIn",
        "companyId": "2356368"
    },
    {
        "id": 873,
        "name": "Purcell Murray Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=95174",
        "website": "http://www.purcellmurray.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "93 employees on LinkedIn",
        "companyId": "95174"
    },
    {
        "id": 874,
        "name": "Pure Haven",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10460640",
        "website": "http://purehaven.com",
        "geography": "Providence, Rhode Island Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "399 employees on LinkedIn",
        "companyId": "10460640"
    },
    {
        "id": 875,
        "name": "Radio Flyer",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1397578",
        "website": "http://www.radioflyer.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "123 employees on LinkedIn",
        "companyId": "1397578"
    },
    {
        "id": 876,
        "name": "Rainbow Play Systems, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=277345",
        "website": "http://www.rainbowplay.com",
        "geography": "Sioux Falls, South Dakota Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "277345"
    },
    {
        "id": 877,
        "name": "Rakuten.com",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=7908",
        "website": "http://www.rakuten.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "148 employees on LinkedIn",
        "companyId": "7908"
    },
    {
        "id": 878,
        "name": "Re-Bath, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=393588",
        "website": "http://www.HomeBrandsGroupLLC.appone.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "112 employees on LinkedIn",
        "companyId": "393588"
    },
    {
        "id": 879,
        "name": "RGI Home",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1309217",
        "website": "http://www.rgihome.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "1309217"
    },
    {
        "id": 880,
        "name": "Ricardo Beverly Hills",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3088993",
        "website": "http://www.ricardobeverlyhills.com",
        "geography": "Greater Seattle Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "67 employees on LinkedIn",
        "companyId": "3088993"
    },
    {
        "id": 881,
        "name": "River City Distributing, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1923843",
        "website": "http://www.rivercitydistributing.com",
        "geography": "Louisville, Kentucky Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "92 employees on LinkedIn",
        "companyId": "1923843"
    },
    {
        "id": 882,
        "name": "Robinson Home Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=917060",
        "website": "http://www.robinsonknife.com",
        "geography": "Buffalo/Niagara, New York Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "917060"
    },
    {
        "id": 883,
        "name": "Rocket Farms, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=795655",
        "website": "http://www.rocketfarms.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "106 employees on LinkedIn",
        "companyId": "795655"
    },
    {
        "id": 884,
        "name": "RXBAR",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3066038",
        "website": "http://www.rxbar.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "176 employees on LinkedIn",
        "companyId": "3066038"
    },
    {
        "id": 885,
        "name": "S.I. Jacobson - Packaging Perfected",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=644547",
        "website": "http://www.sij.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "59 employees on LinkedIn",
        "companyId": "644547"
    },
    {
        "id": 886,
        "name": "S.R. Smith",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=129119",
        "website": "https://srsmith.com",
        "geography": "Portland, Oregon Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "83 employees on LinkedIn",
        "companyId": "129119"
    },
    {
        "id": 887,
        "name": "S'well",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1953591",
        "website": "http://www.swellbottle.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "142 employees on LinkedIn",
        "companyId": "1953591"
    },
    {
        "id": 888,
        "name": "Safe Industries",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1632646",
        "website": "http://www.safeindustries.com",
        "geography": "Greenville, South Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "64 employees on LinkedIn",
        "companyId": "1632646"
    },
    {
        "id": 889,
        "name": "Samsill Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=121081",
        "website": "http://www.samsill.com",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "121081"
    },
    {
        "id": 890,
        "name": "Sanrio, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=33701",
        "website": "http://www.sanrio.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "169 employees on LinkedIn",
        "companyId": "33701"
    },
    {
        "id": 891,
        "name": "Savannah Bee Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1845310",
        "website": "http://www.savannahbee.com",
        "geography": "Savannah, Georgia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "1845310"
    },
    {
        "id": 892,
        "name": "SBM Life Science",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10956393",
        "website": "https://www.bayeradvanced.com",
        "geography": "Raleigh-Durham, North Carolina Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "236 employees on LinkedIn",
        "companyId": "10956393"
    },
    {
        "id": 893,
        "name": "Scentsy Wickless Candles-Independent Consultant",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1188816",
        "website": "http://www.womenwithwax.com",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "342 employees on LinkedIn",
        "companyId": "1188816"
    },
    {
        "id": 894,
        "name": "School District 25",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3989171",
        "website": "http://www.d25.k12.id.us/",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "105 employees on LinkedIn",
        "companyId": "3989171"
    },
    {
        "id": 895,
        "name": "Schraad",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3165562",
        "website": "http://www.schraadinc.com",
        "geography": "Oklahoma City, Oklahoma Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "3165562"
    },
    {
        "id": 896,
        "name": "SCS Direct Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5056919",
        "website": "http://www.scsdirectinc.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "5056919"
    },
    {
        "id": 897,
        "name": "Segway",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=18050",
        "website": "http://www.segway.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "168 employees on LinkedIn",
        "companyId": "18050"
    },
    {
        "id": 898,
        "name": "Sellmark Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=684577",
        "website": "http://www.sellmark.net",
        "geography": "Dallas/Fort Worth Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "71 employees on LinkedIn",
        "companyId": "684577"
    },
    {
        "id": 899,
        "name": "Sensory Spectrum",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=121340",
        "website": "http://www.sensoryspectrum.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "121340"
    },
    {
        "id": 900,
        "name": "Seventh Generation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=45156",
        "website": "http://www.seventhgeneration.com",
        "geography": "Burlington, Vermont Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "187 employees on LinkedIn",
        "companyId": "45156"
    },
    {
        "id": 901,
        "name": "Shankman",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=15145265",
        "website": "http://www.shankmanandassociates.com",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "70 employees on LinkedIn",
        "companyId": "15145265"
    },
    {
        "id": 902,
        "name": "ShelterLogic",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=609214",
        "website": "http://www.shelterlogic.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "117 employees on LinkedIn",
        "companyId": "609214"
    },
    {
        "id": 903,
        "name": "Simms Fishing Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=557059",
        "website": "http://www.simmsfishing.com",
        "geography": "Great Falls, Montana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "129 employees on LinkedIn",
        "companyId": "557059"
    },
    {
        "id": 904,
        "name": "simplehuman",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=87123",
        "website": "http://www.simplehuman.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "106 employees on LinkedIn",
        "companyId": "87123"
    },
    {
        "id": 905,
        "name": "Skyrocket",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1446528",
        "website": "http://www.SkyrocketOn.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "80 employees on LinkedIn",
        "companyId": "1446528"
    },
    {
        "id": 906,
        "name": "Slimfast",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10482527",
        "website": "http://SlimFast.com",
        "geography": "West Palm Beach, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "10482527"
    },
    {
        "id": 907,
        "name": "Smith",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=123581",
        "website": "http://www.SVnaturally.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "123581"
    },
    {
        "id": 908,
        "name": "SMSB Consulting Group",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1763043",
        "website": "http://www.smsb.com/",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "53 employees on LinkedIn",
        "companyId": "1763043"
    },
    {
        "id": 909,
        "name": "SodaStream USA Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=6874770",
        "website": "http://www.sodastreamusa.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "6874770"
    },
    {
        "id": 910,
        "name": "Sokol and Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1243318",
        "website": "http://www.sokolcustomfoods.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "1243318"
    },
    {
        "id": 911,
        "name": "Southern Eagle Distributing Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=445890",
        "website": "http://www.southerneagledist.com",
        "geography": "Fort Pierce, Florida Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "445890"
    },
    {
        "id": 912,
        "name": "Southern Tier Brewing Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=699086",
        "website": "http://southerntierbrewing.com",
        "geography": "Jamestown, New York Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "699086"
    },
    {
        "id": 913,
        "name": "Speakman",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1102242",
        "website": "http://www.speakman.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "102 employees on LinkedIn",
        "companyId": "1102242"
    },
    {
        "id": 914,
        "name": "Speck Products",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=398290",
        "website": "http://www.speckproducts.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "156 employees on LinkedIn",
        "companyId": "398290"
    },
    {
        "id": 915,
        "name": "Spring Air Mattress Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5097722",
        "website": "http://www.springairusa.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "65 employees on LinkedIn",
        "companyId": "5097722"
    },
    {
        "id": 916,
        "name": "Standards of Excellence",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=122386",
        "website": "http://www.standardsofexcellence.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "122386"
    },
    {
        "id": 917,
        "name": "STAUBER",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=148736",
        "website": "http://www.stauberusa.com",
        "geography": "Orange County, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "148736"
    },
    {
        "id": 918,
        "name": "Sunshine Makers Inc./Simple Green",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=725857",
        "website": "http://www.simplegreen.com",
        "geography": "Orange County, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "58 employees on LinkedIn",
        "companyId": "725857"
    },
    {
        "id": 919,
        "name": "Sweet Harvest Foods",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1850058",
        "website": "http://www.sweetharvestfoods.com",
        "geography": "Greater Minneapolis-St. Paul Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "1850058"
    },
    {
        "id": 920,
        "name": "Swimways Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=155641",
        "website": "http://www.swimways.com",
        "geography": "Norfolk, Virginia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "91 employees on LinkedIn",
        "companyId": "155641"
    },
    {
        "id": 921,
        "name": "Tanga",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1159836",
        "website": "http://www.tanga.com",
        "geography": "Phoenix, Arizona Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "133 employees on LinkedIn",
        "companyId": "1159836"
    },
    {
        "id": 922,
        "name": "Tanya Creations, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1210438",
        "website": "http://www.tanyacreations.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "56 employees on LinkedIn",
        "companyId": "1210438"
    },
    {
        "id": 923,
        "name": "Tegu",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2108889",
        "website": "http://www.tegu.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "2108889"
    },
    {
        "id": 924,
        "name": "Telebrands Corp.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=649858",
        "website": "http://www.telebrands.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "138 employees on LinkedIn",
        "companyId": "649858"
    },
    {
        "id": 925,
        "name": "Tender Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=685381",
        "website": "http://www.tendercorp.com",
        "geography": "Burlington, Vermont Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "69 employees on LinkedIn",
        "companyId": "685381"
    },
    {
        "id": 926,
        "name": "Texas National Guard",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5911615",
        "website": "http://www.txarng.com/",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "83 employees on LinkedIn",
        "companyId": "5911615"
    },
    {
        "id": 927,
        "name": "The Cary Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1480355",
        "website": "http://www.thecarycompany.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "71 employees on LinkedIn",
        "companyId": "1480355"
    },
    {
        "id": 928,
        "name": "The Clever Factory Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8824668",
        "website": "http://www.cleverfactory.com/",
        "geography": "Greater Nashville Area, TN",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "8824668"
    },
    {
        "id": 929,
        "name": "The Emerson Group (A Consumer Products Equity Organization)",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2149897",
        "website": "http://www.emersongroup.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "111 employees on LinkedIn",
        "companyId": "2149897"
    },
    {
        "id": 930,
        "name": "The Harvest Group",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=56955",
        "website": "http://www.harvestgroup.com",
        "geography": "Fayetteville, Arkansas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "86 employees on LinkedIn",
        "companyId": "56955"
    },
    {
        "id": 931,
        "name": "The J.R. Watkins Co.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=431056",
        "website": "http://www.jrwatkins.com",
        "geography": "La Crosse, Wisconsin Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "316 employees on LinkedIn",
        "companyId": "431056"
    },
    {
        "id": 932,
        "name": "The LANG Companies, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1618750",
        "website": "http://www.thelangcompanies.com",
        "geography": "Greater Milwaukee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "1618750"
    },
    {
        "id": 933,
        "name": "The Mountain Valley Spring Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=154041",
        "website": "http://www.mountainvalleyspring.com",
        "geography": "Little Rock, Arkansas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "82 employees on LinkedIn",
        "companyId": "154041"
    },
    {
        "id": 934,
        "name": "The Northwest Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=96642",
        "website": "http://www.thenorthwest.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "186 employees on LinkedIn",
        "companyId": "96642"
    },
    {
        "id": 935,
        "name": "The Onyx Collection",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1750648",
        "website": "http://www.onyxcollection.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "1750648"
    },
    {
        "id": 936,
        "name": "The Outdoor Recreation Group",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1005532",
        "website": "http://www.torgusa.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "1005532"
    },
    {
        "id": 937,
        "name": "The Stow Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=125260",
        "website": "http://www.TheStowCompany.com",
        "geography": "Greater Grand Rapids, Michigan Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "125 employees on LinkedIn",
        "companyId": "125260"
    },
    {
        "id": 938,
        "name": "The Upper Deck Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8410",
        "website": "http://www.upperdeck.com",
        "geography": "Greater San Diego Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "288 employees on LinkedIn",
        "companyId": "8410"
    },
    {
        "id": 939,
        "name": "Therma-stor",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=654957",
        "website": "http://www.thermastor.com",
        "geography": "Madison, Wisconsin Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "121 employees on LinkedIn",
        "companyId": "654957"
    },
    {
        "id": 940,
        "name": "TM International",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=548295",
        "website": "http://www.tattoomanufacturing.com",
        "geography": "Tucson, Arizona Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "548295"
    },
    {
        "id": 941,
        "name": "Tom's of Maine",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=43420",
        "website": "http://www.tomsofmaine.com",
        "geography": "Portland, Maine Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "91 employees on LinkedIn",
        "companyId": "43420"
    },
    {
        "id": 942,
        "name": "Townley, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1522828",
        "website": "http://www.townleygirl.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "1522828"
    },
    {
        "id": 943,
        "name": "TPR Holdings LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1923217",
        "website": "http://www.tprholdings.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "52 employees on LinkedIn",
        "companyId": "1923217"
    },
    {
        "id": 944,
        "name": "Travelpro Products, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=150141",
        "website": "http://www.travelpro.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "87 employees on LinkedIn",
        "companyId": "150141"
    },
    {
        "id": 945,
        "name": "Trends International LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=43477",
        "website": "http://www.trendsinternational.com",
        "geography": "Indianapolis, Indiana Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "219 employees on LinkedIn",
        "companyId": "43477"
    },
    {
        "id": 946,
        "name": "Triboro Quilt Manufacturing Corp.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=451639",
        "website": "http://www.triboro.com/",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "451639"
    },
    {
        "id": 947,
        "name": "Troy-CSL Lighting",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3987518",
        "website": "http://www.csllighting.com/",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "61 employees on LinkedIn",
        "companyId": "3987518"
    },
    {
        "id": 948,
        "name": "Turf Equipment and Supply Company",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=758962",
        "website": "http://www.turf-equipment.com",
        "geography": "Baltimore, Maryland Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "82 employees on LinkedIn",
        "companyId": "758962"
    },
    {
        "id": 949,
        "name": "Turtle Wax, Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=53640",
        "website": "http://www.turtlewax.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "135 employees on LinkedIn",
        "companyId": "53640"
    },
    {
        "id": 950,
        "name": "Tweezerman International, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=957589",
        "website": "http://www.tweezerman.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "92 employees on LinkedIn",
        "companyId": "957589"
    },
    {
        "id": 951,
        "name": "U-Line Corporation",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=946491",
        "website": "http://www.u-line.com",
        "geography": "Greater Milwaukee Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "76 employees on LinkedIn",
        "companyId": "946491"
    },
    {
        "id": 952,
        "name": "Umarex USA, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1818382",
        "website": "http://www.umarexusa.com",
        "geography": "Fort Smith, Arkansas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "1818382"
    },
    {
        "id": 953,
        "name": "UNITED GILSONITE LABORATORIES (UGL®)",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=545673",
        "website": "http://www.ugl.com",
        "geography": "Scranton, Pennsylvania Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "57 employees on LinkedIn",
        "companyId": "545673"
    },
    {
        "id": 954,
        "name": "United Supermarket",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5952287",
        "website": "http://www.unitedsupermarkets.com/",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "211 employees on LinkedIn",
        "companyId": "5952287"
    },
    {
        "id": 955,
        "name": "Universal Beauty Products Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=490218",
        "website": "http://universalbeauty.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "68 employees on LinkedIn",
        "companyId": "490218"
    },
    {
        "id": 956,
        "name": "Universal Woods",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2669381",
        "website": "http://www.universalwoods.com",
        "geography": "Louisville, Kentucky Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "72 employees on LinkedIn",
        "companyId": "2669381"
    },
    {
        "id": 957,
        "name": "UPPAbaby",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=779178",
        "website": "http://www.uppababy.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "74 employees on LinkedIn",
        "companyId": "779178"
    },
    {
        "id": 958,
        "name": "US-Mattress, CarolinaRustica, PartySuppliesDelivered, DayBedDeals",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=383700",
        "website": "http://www.us-mattress.com/",
        "geography": "Greater Detroit Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "383700"
    },
    {
        "id": 959,
        "name": "VAYA Pharma, Inc",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5090978",
        "website": "http://www.vayapharma.com",
        "geography": "Baltimore, Maryland Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "5090978"
    },
    {
        "id": 960,
        "name": "Vigo Industries",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1400624",
        "website": "http://www.vigoindustries.com",
        "geography": "Greater New York City Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "53 employees on LinkedIn",
        "companyId": "1400624"
    },
    {
        "id": 961,
        "name": "Viking Distributing East",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=40698",
        "website": "http://www.vikingdistributingeast.com",
        "geography": "Greater Atlanta Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "123 employees on LinkedIn",
        "companyId": "40698"
    },
    {
        "id": 962,
        "name": "Virginia Air Distributors",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=260660",
        "website": "http://www.virginiaair.com",
        "geography": "Richmond, Virginia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "110 employees on LinkedIn",
        "companyId": "260660"
    },
    {
        "id": 963,
        "name": "Vista Professional Outdoor Lighting",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=636416",
        "website": "http://www.vistapro.com",
        "geography": "Greater Los Angeles Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "636416"
    },
    {
        "id": 964,
        "name": "Visual Comfort",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=1004436",
        "website": "http://www.visualcomfort.com",
        "geography": "Houston, Texas Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "130 employees on LinkedIn",
        "companyId": "1004436"
    },
    {
        "id": 965,
        "name": "W Atlee Burpee",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=320755",
        "website": "http://www.burpee.com",
        "geography": "Greater Philadelphia Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "98 employees on LinkedIn",
        "companyId": "320755"
    },
    {
        "id": 966,
        "name": "Wallside Windows",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=983759",
        "website": "http://www.wallsidewindows.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "73 employees on LinkedIn",
        "companyId": "983759"
    },
    {
        "id": 967,
        "name": "Water Pik, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=29921",
        "website": "http://www.waterpik.com",
        "geography": "Fort Collins, Colorado Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "247 employees on LinkedIn",
        "companyId": "29921"
    },
    {
        "id": 968,
        "name": "Wayne Water Systems",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=57274",
        "website": "http://www.waynewatersystems.com",
        "geography": "United States",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "63 employees on LinkedIn",
        "companyId": "57274"
    },
    {
        "id": 969,
        "name": "Weatherby Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=17897770",
        "website": "http://www.weatherby.com/",
        "geography": "San Luis Obispo, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "17897770"
    },
    {
        "id": 970,
        "name": "Weiman Products, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=741426",
        "website": "http://www.weiman.com",
        "geography": "Greater Chicago Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "122 employees on LinkedIn",
        "companyId": "741426"
    },
    {
        "id": 971,
        "name": "West Chester Protective Gear",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=630513",
        "website": "http://www.westchestergear.com",
        "geography": "Cincinnati, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "630513"
    },
    {
        "id": 972,
        "name": "Whitmor",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=322789",
        "website": "http://www.whitmor.com",
        "geography": "Greater Memphis Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "81 employees on LinkedIn",
        "companyId": "322789"
    },
    {
        "id": 973,
        "name": "Wiley X, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=3280064",
        "website": "http://www.wileyx.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "69 employees on LinkedIn",
        "companyId": "3280064"
    },
    {
        "id": 974,
        "name": "Williams Comfort Air, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=5821369",
        "website": "http://williamscomfortair.com",
        "geography": "",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "62 employees on LinkedIn",
        "companyId": "5821369"
    },
    {
        "id": 975,
        "name": "Winston Products, LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=8058968",
        "website": "http://www.winstonproducts.us",
        "geography": "Cleveland/Akron, Ohio Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "54 employees on LinkedIn",
        "companyId": "8058968"
    },
    {
        "id": 976,
        "name": "Worldwise, Inc. (Pet Products)",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=10798470",
        "website": "http://www.worldwise.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "50 employees on LinkedIn",
        "companyId": "10798470"
    },
    {
        "id": 977,
        "name": "Xlear, Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=125719",
        "website": "http://www.Xlear.com",
        "geography": "Provo, Utah Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "60 employees on LinkedIn",
        "companyId": "125719"
    },
    {
        "id": 978,
        "name": "Yogi Tea",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2809926",
        "website": "http://www.yogiproducts.com",
        "geography": "Eugene, Oregon Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "96 employees on LinkedIn",
        "companyId": "2809926"
    },
    {
        "id": 979,
        "name": "Yogibo LLC",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=957740",
        "website": "http://www.yogibo.com",
        "geography": "Greater Boston Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "94 employees on LinkedIn",
        "companyId": "957740"
    },
    {
        "id": 980,
        "name": "Zero Motorcycles Inc.",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=400078",
        "website": "http://zeromotorcycles.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "161 employees on LinkedIn",
        "companyId": "400078"
    },
    {
        "id": 981,
        "name": "Zinus",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=2196600",
        "website": "http://www.zinus.com",
        "geography": "San Francisco Bay Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "79 employees on LinkedIn",
        "companyId": "2196600"
    },
    {
        "id": 982,
        "name": "Zurn Wilkins",
        "linkedin_url": "https://www.linkedin.com/sales/accounts/insights?companyId=606645",
        "website": "http://www.zurn.com",
        "geography": "San Luis Obispo, California Area",
        "industry": "Consumer Goods",
        "company_headcount": "",
        "employees_on_linkedin": "55 employees on LinkedIn",
        "companyId": "606645"
    }
]

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
    "AQEDARpZzHQEo07OAAABYy3QcusAAAFj2A2NvVYAv0Xgit5PG2k4pnds2EPgKZtCCSMjIUXcQNQa8EtEqqApnIHlmZU_nz6Gut7T1xYpykyVDPca9W3pvBw_iVpGG5DC2vdiHjTJsAIj87bWnEwRWxF_",
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
