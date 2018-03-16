var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var FactSchema = new Schema({
    description: String
});

module.exports = mongoose.model('Fact', FactSchema);