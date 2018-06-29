var get_info = require('./get_info.js');
var best_lead = require('./best_lead.js');
// get_additional_comp_info
// find_best_lead

// async function output(){
//   var result = await thing(6651289);
//   // await console.log("result: " + result)
//   console.log(result)
// }

module.exports = function(app, db) {
  app.get('/comp', async (req, res) => {
    if (!req.query.id) {
      return res.send({"error": "Not sufficient information"});
    } else if (req.query.id) {
      const comp_id = req.query.id;
      var info = await get_info.get_additional_comp_info(comp_id);
      // var lead_info = await common.find_best_lead(comp_id, "breadware.com")
      return res.send(info);
    }
  });
};
