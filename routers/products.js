const {Product} = require('../models/product');
const express = require('express');
const {Category} = require('../models/category');
const { default: mongoose } = require('mongoose');
//const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('invalid image type');
      if(isValid){
        uploadError = null
      }

      cb(null, '/public/uploads')

    },
    filename: function (req, file, cb) {
       
     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     const fileName = file.originalname.split(' ').join('-'); 
     const extension = FILE_TYPE_MAP[file.mimetype];
     cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })

  const uploadOptions = multer({ storage: storage })

router.get(`/`, async(req,res) => {
    let filter= {};
    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).select('name image -_id').populate('category');
    if(!productList){
        res.status(500).json({success:false})
    }
     res.send(productList);
    })
router.get(`/`, async(req,res) => {
       const product = await Product.findById(req.params.id).populate('category');

       if(!product){
        res.status(500).json({success: false})
       }
       res.send(product);

})
//router.post(`/`,(req,res) => {
//    const product = new Product({
//        name: req.body.name,
//        image: req.body.image,
//        countInStock:req.body.countInStock
//    })
//    product.save().then((createdProduct=>{
//        res.status(201).json(createdProduct)
//    })).catch((err)=>{
//        res.status(500).json({
//            error:err,
//            success:false
//        })
//    })
//    res.send(product);
//})

router.post(`/`, uploadOptions.single('image'),async(req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('invalid category')
    const file = req.file;
    if(!file) return res.status(400).send("no image selected");
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDiscription: req.body.richDiscription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,


    })
    product = await product.save();

    if(!product)
    return res.status(500).send("the product cannot be created");
    res.send(product);
})

router.put(`/:id`,uploadOptions.single('image'),async (req,res)=> {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('invalid category')
    const product = await Product.findById(req.body.product);
    if(!product) return res.status(400).send('invalid product')
    const file = req.file;
    let imagepath;
    if(file){
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        imagepath = `${basePath}${fileName}`
    }else{
        imagepath = product.image
    }
    
    const Updatedproduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        description: req.body.description,
        richDiscription: req.body.richDiscription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,


        },
        { new: true}
    )
    if(!Updatedproduct)
    return res.status(500).send('the product cannot be updated')
    res.send(Updatedproduct);
})



router.post(`/`,(req,res) => {
    
        const newProduct = req.body;
        console.log(newProduct);
        res.send(newProduct)
        
    
    
})
router.delete('/:id',(req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true, message:'the product is deleted'})
        }else {
            return res.status(404).json({success: false, message:"product not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error:err})
    })
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count)=> count)

    if(!productCount){
     res.status(500).json({success: false})
    }
    res.send({productCount: productCount});    
})

router.get(`get/featured/:count`, async(req,res) => {
    const count = req.params.count ? req.params.count: 0
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products){
     res.status(500).json({success: false})
    }
    res.send(products);

})
router.put(
    '/gallery-images/:id',
    uploadOptions.array('images',10),
    async (req, res)=>{
        if(!mongoose.isValidObjectId(Req,params.id)){
            return res.status(400).send('Invalid product id')
        }
        const files = req.files
        let imagesPaths = [];
        const basePaths = `${req.protocol}://${req.get('host')}/public/upload/`;
        if(files){
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            })
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            {new : true}
        )
        if(!product)
        return res.status(500).send('the product cannot be updated')
        res.send(product);
    }
)
module.exports = router;
