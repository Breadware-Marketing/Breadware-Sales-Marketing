var common = require('./common.js');
// get_additional_comp_info
// find_best_lead

// get rid of this nonsense
function sleep(miliseconds) {
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}

module.exports = function(app, db) {
  app.get('/comp', (req, res) => {
    if (!req.query.id) {
      return res.send({"error": "Not sufficient information"});
    } else if (req.query.id) {
      const comp_id = req.query.id;
      website = common.get_additional_comp_info(comp_id)
      sleep(2000)
      return res.send({"website": website});
    }
  });
};
