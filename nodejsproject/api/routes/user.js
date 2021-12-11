const express = require('express');
const router = express.Router();
const {Validator} = require('node-input-validator');
const userdb = require('../models/users');

router.post('/adduser',(req, res, next) => {
    const userdatabase = new userdb({
        "name" : req.body.name,
        "phonenumber" : req.body.phonenumber,
        "address" : req.body.address,
        "state" : req.body.state,
        "city" : req.body.city,
		"password" : req.body.password
    });
	userdb.findOne({"name" : req.body.name},(err, finddata) => {
		console.log(finddata,err,"finddata,err");
		if(err){
			res.json({
				status : 401,
				message : "Error",
				data : err
			});
		} else if((finddata != '') && (finddata != null)) {
			res.json({
				status : 435,
				message : "Username Already Exists",
			});
		} else if((finddata == '') || (finddata == null)){
			userdatabase
			.save()
			.then(result => {
				res.json({
					status : 200,
					message : "User Created Successfully",
					Data : result
				});
				res.end();
			})
			.catch(error => {
				res.json({
					status : 404,
					message : "Unable to create User",
					error : error
				});
				res.end();
			});
		}
	});
    
});



router.get('/getuserdetails',(req, res, next) => {
    userdb
    .find()
    .exec()
    .then(result => {
        res.json({
            status : 200,
            message : "User Details Fetched Successfully",
            Data : result
        });
        res.end();
    })
    .catch(error => {
        res.json({
            status : 404,
            message : "No users found"
        });
        res.end();
    });
});

router.post('/loginuser', (req, res, next) => {
	console.log(req.body.name , req.body.password);
	try{
		userdb.findOne({"name" : req.body.name},(err,finddata) => {
			console.log(err,finddata,"FISDKFSDJF");
			if(err){
				res.json({
                    status : 404,
                    message : "Error in Finding User data",
                    error : err
                });
                res.end();
			} else if((finddata == null) || (finddata == '')){
				res.json({
                    status : 422,
                    message : "User data Found Null",
                    data : []
                }); 
                res.end();
			} else if ((finddata != null) || (finddata != '')){
				console.log(finddata,"finddata");
				if(finddata.password === req.body.password){
					if((finddata.name != 'Admin') && (finddata.password != 'Admin')){
						res.json({
							status : 200,
							message : "Logged In Successfully",
							data : finddata
						});
						res.end();
					} else {
						res.json({
							status : 412,
							message : "Invalid Login"
						});
						res.end();
					}
				} else {
					res.json({
						status : 422,
						message : "Invalid Password"
					});
					res.end();
				}
            }
		});
	} catch(err){
		res.json({
			status:404,
			message:"User Login Catch Error",
			data:err
		});
		res.end();
	}
});

router.post('/loginadmin', (req, res, next) => {
	console.log(req.body.name);
	try{
		userdb.find({"name" : req.body.name},(err,finddata) => {
			console.log(err,finddata);
			if(err){
				res.json({
                    status : 404,
                    message : "Error in Finding Admin data",
                    error : err
                });
                res.end();
			} else if((finddata == null) || (finddata == '')){
				res.json({
                    status : 422,
                    message : "No Admin Data Found",
                    data : []
                }); 
                res.end();
			} else if ((finddata != null) || (finddata != '')){
				console.log(finddata[0]._id,"finddata");
				if((finddata[0].name === 'Admin') && (finddata[0].password === 'Admin')){
					userdb
						.find()
						.exec()
						.then(result => {
							res.json({
								status : 200,
								message : "User Details Fetched Successfully",
								Data : result
							});
							res.end();
						})
						.catch(error => {
							res.json({
								status : 404,
								message : "No users found"
							});
							res.end();
						});
				} else {
					res.json({
						status : 412,
						message : "Invalid Login"
					});
					res.end();
				}
            }
		});
	} catch(err){
		res.json({
			status:404,
			message:"User Login Catch Error",
			data:err
		});
		res.end();
	}
});


router.post('/getonedata/:userid', (req, res, next) => {
    try{
        const id = req.params.userid;
        userdb.findOne({"_id" : id},(err, finddata) => {
            if(err){
                res.json({
                    status : 404,
                    message : "Error in Finding User data",
                    error : err
                });
                res.end();
            } else if((finddata == null) || (finddata == '')){
                res.json({
                    status : 422,
                    message : "User data Found Null",
                    data : []
                }); 
                res.end();
            } else if ((finddata != null) || (finddata != '')){
                res.json({
                    status : 200,
                    message : "User Data Fetched Successfully",
                    data : finddata
                });
                res.end();
            }
        });
    }
    catch(err){
        res.json({
			status:404,
			message:"User Database Catch ERROR",
			data:err
		});
		res.end();
    }
});

router.post('/updatedata/:_id',(req, res, next) => {
    try{
        console.log(req.params._id);
		userdb.findOne({"_id":req.params._id},(err,updatedata)=>{
            console.log(updatedata);
			if(err){
				res.json({
					status:404,
					message:'Update User Details Catch ERROR',
					data:err
				});
				res.end();
			}else if((updatedata=="")||(updatedata==null)){
				res.json({
					status:422,
					message:'Update User Data Found Null',
					date:[]
				});
				res.end();
			}else if((updatedata!=="")||(updatedata!==null)){
				userdb.updateOne({"_id":req.params._id},{$set:req.body},(err,updatedata)=>{
					if(err){
						res.json({
							status:404,
							message:'Unable to Update User Data 123',
                            Error : err
						});
						res.end();
					}else{	
						res.json({
                            status : 200,
                            message : "User Details Updated Successfully"
                        });
                        res.end();
					}
				});
			}
		});	
	}catch(err){
        console.log(err);
		res.json({
			status:404,
			message:"Unable to Update User Data 456",
			data:err
		});
		res.end();
	}	
});

router.post('/deleteuser/:deleteid',(req, res, next) => {
    try{
		userdb.findOne({"_id":req.params.deleteid},(err,finddata)=>{
			if(err){
				res.json({
					status:404,
					message:" Delete User Details Catch ERROR",
					data:err
				});
				res.end();
			}
			else if( ( finddata == null ) || ( finddata == "") ){
				res.json({
					status:422,
					message:"Delete User Data find Null"
				});
				res.end();
			}
			else if( ( finddata != null ) || ( finddata != "") ){
				userdb.remove({"_id":req.params.deleteid},(err,removedata)=>{
					if( err ){
						res.json({
							status:404,
							message:"Delete User Data Catch ERROR",
							data:err
						});
						res.end();
					}
					else{	
						res.json({
							status:200,
							message:"Delete User Data Success"
						});
						res.end();						
					}
				});
			}
		});
	}catch(err){
		res.json({
			status:404,
			message:'Delete User Data Catch Error',
			data:err
		});
		res.end();
	}

});

module.exports = router;