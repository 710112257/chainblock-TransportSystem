const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/transport')

    const db = mongoose.connection
    db.on('error', console.error.bind(console, '连接错误：'))
    db.once('open', (callback) => {
        console.log('users连接成功！！')
    })

    var schema = new mongoose.Schema({ 
        username:String, 
        password: String,
    },{
        collection:'admin'
    });   
    users = mongoose.model('admin',schema);
module.exports=users;