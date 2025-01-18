const express =require('express');
const cors=require("cors")
const app = express();
const dotenv =require('dotenv');
const connectMongoDB =require('./db/mongodb');
const mongoose=require('mongoose');
dotenv.config();
 
app.use(cors());
app.use(express.json());


connectMongoDB();
 const ProductSchema=new mongoose.Schema({
    productName:String,
    productPrice:Number,
    currencyCode: String,
    numberofSale:Number,
    productRating: String,
    isfreeShipping: Boolean,
    shopName: String
 })
 const productModel = mongoose.model('Product', ProductSchema);

 app.post("/product", async (req, res) => {

   let body = req.body;

   if (
       !body.productName
       || !body.productPrice
       || !body.currencyCode
       || !body.numberofSale
       || !body.productRating
       || !body.isfreeShipping
       || !body.shopName
   ) {

       res.status(400).send({
           message: `required field missing, all fields are required: 
           productName
           productPrice
           currencyCode
           numberofSale
           productRating
           isfreeShipping
           shopName`
       })
       return;
   }

   let result = await productModel.create({

       productName: body.productName,
       productPrice: body.productPrice,
       currencyCode: body.currencyCode,
       numberofSale: body.numberofSale,
       productRating: body.productRating,
       isfreeShipping: body.isfreeShipping,
       shopName: body.shopName,

   }).catch(e => {
       console.log("error in db: ", e);
       res.status(500).send({ message: "db error in saving product" });
   })

   console.log("result: ", result);
   res.send({ message: "product is added in database" });
});
app.get('/products' ,async(req,res)=>{
    let result=await productModel
    .find({})
    .exec()
    .catch(e=>{
        console.log("error in db:",e);
        res.status(500).send({message:"error in getting all products"})
        return

    })
    res.send({
        message:"all products success",
        data:result
    });
})

app.get("/product/:id", async (req, res) => {

    let result = await productModel
        .findOne({_id: req.params.id})
        .exec()
        .catch(e => {
            console.log("error in db: ", e);
            res.status(500).send({ message: "error in getting all products" });
            return
        })

    res.send({
        message: "all products success ",
        data: result
    });
});

app.delete("/product/:id", async (req, res) => {

    let _id = req.params.id;

    try {
        const result = await productModel.findByIdAndDelete(_id);
        console.log("Deleted product: ", result);
        res.send({
            message: "deleted"
        });
        return;

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "db error"
        })
    }



})
app.put("/product/:id", async (req, res) => {

    let _id = req.params.id;
    let body = req.body;

    try {
        const result = await productModel.findByIdAndUpdate(_id, body, { new: true });
        console.log("updated product: ", result);
        res.send({
            message: "updated"
        });
        return;

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "db error"
        })
    }
})



app.listen(7060,()=>{
    console.log("server running on post 7060")
})


 