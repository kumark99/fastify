//********mongoDB connection details*******
//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/products'; //product is database name in mongo
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//********mongoDB connection details

//*********Product Model**********
// Product Schema Model 
var ProductSchema = mongoose.Schema({
    pid:Number,
    name: String,
    description: String,
    price: Number,
    category: String
  });

//compile schema to model
var product = mongoose.model('product', ProductSchema, 'product'); //product is the collection name in mongo
var mongoose = require('mongoose');
//*********Product Model**********

const fastify = require('fastify')({logger:true})
const PORT =3000

//enable swagger-documents
//********SWAGGER API **********************
fastify.register(require('fastify-swagger'),{
    exposeRoute:true,
    routePrefix: '/docs',
    swagger:{
        info: {title:'product-fastify-api'},
    }
})

//Hello route
fastify.get('/hello',(req,resp) => {
    resp.send({'hello':'world'});
})

// ********* REST API below ***************
//GET All products
fastify.get('/products',(req,resp) =>{
    result = product.find().lean().select("pid name description price categroy").exec(function(err, result){
       resp.send(result);
    })

})

//READ a Product
fastify.get('/products/:pid',(req,resp) =>{
    const {pid} = req.params
    result = product.find({'pid':pid}).lean().select("pid name description price categroy").exec(function(err, result){
        resp.send(result);
     })
    
})

//CREATE a new product
fastify.post('/product',(req,resp) =>{
    const {pid} = req.body
    const {name} = req.body 
    const {price} = req.body
    const {description} = req.body
    const {category} = req.body
    
   // var product = mongoose.model('product', ProductSchema, 'product');
 
  // a document instance
   var prod1 = new product({pid:pid,name:name,description:description,price:price,category:category });
 
   // save model to database
   prod1.save(function (err, product) {
      if (err) return console.error(err);
      console.log(prod1.name + " saved to product collection.");
    });
   resp.code(201).send(prod1)
   
})

//DELETE a Product
fastify.delete('/products/:pid',(req,resp) =>{
    const {pid} = req.params
    const filter = {pid:pid};

    product.findOneAndRemove(filter,function(err,prod){
        if(err){
            console.log(err)
        }else{
            resp.send(`Product id ${pid} REMOVED Successfully!..`)
        }
    });
})

//UPDATE a  product
fastify.put('/products',(req,resp) =>{
    const {pid} = req.body
    const {name} = req.body
    const {description} = req.body
    const filter = {pid:pid};
    const update = {name:name,description:description,}
    product.findOneAndUpdate(filter,update,{new:true},function(err,prod){
        if(err){
            console.log(err)
        }else{
            resp.send(`Product id ${pid} UPDATED Successfully!..`)
        }
    });
  

})

const start = async()=>{
    try{
        await fastify.listen(PORT)
    }catch(error){
        fastify.log.error(error)
        process.exit(1)
    }
}

start()