const mongoose = require('mongoose');
mongoose.connect(process.env.dburl);
const db = mongoose.connection;
//mongoose.set('useFindAndModify', false);

db.on('error', console.error.bind(console, 'connection error:'));

module.exports=mongoose;