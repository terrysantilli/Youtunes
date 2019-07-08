const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const jwt = require('jsonwebtoken');



// @route DELETE api/items/:id
// @desc Delete an Item
// @access Public
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(()=> res.json({success: true})))    
        .catch(err => res.status(404).json({success: false}));
});


// @route POST routes/api/users
router.post('/register', (req, res) => {

    if(!req.body.userName){
        return res.send({
            success: false,
            message: 'Error: Username cannot be blank.'
        });
    }

    if(!req.body.email){
        return res.send({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }

    if(!req.body.password){
        return res.send({
            success: false,
            message: 'Error: Username cannot be blank.'
        });
    }

    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email.toLowerCase(),
        
    });
    newUser.password = newUser.generateHash(req.body.password);


    // Steps:
    // 1. Verify username doesn't exist
    // 2. Save user
    User.find({
        userName: req.body.userName
    }, (err, previousUsers) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: Server error.'
            });
        }else if(previousUsers.length > 0) {
            return res.send({
                success: false,
                message: 'Error: Username already exists'
            });
        }

        // Save the new user
        newUser.save((err, user) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            }
            return res.send({
                success: true,
                message: 'User has been registered.'
            });
        });
    });
});

router.post('/signin', (req, res) => {
    if(!req.body.userName){
        return res.send({
            success: false,
            message: 'Error: Username cannot be blank'
        });
    }

    if(!req.body.password){
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank'
        });
    }

    User.find({
        userName: req.body.userName
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: server error.'
            });
        }

        if(users.length != 1){
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        }

        const user = users[0];
        if(!user.validPassword(req.body.password)){
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        }
        // Otherwise, correct user
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            
            jwt.sign({ user: user }, 'secretkey', (err, token) => {
                return res.json({
                    success: true,
                    token: token
                });
            });
            
        });
    });
})

router.get('/verify', (req, res) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    console.log(token);

    // Verify the token is one of a kind and it's not deleted

    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: Server error.'
            });
        }

        if(sessions.length != 1) {
            return res.send({
                success: false,
                message:  'Error: Invalid' 
            });
        }else {
            return res.send({
                success: true,
                message: 'Success'
            });
        }
    });
});

router.get('/logout', (req, res) => {
     // Get the token
     const { query } = req;
     const { token } = query;
     // ?token=test
     console.log(token);
 
     // Verify the token is one of a kind and it's not deleted
 
     UserSession.findOneAndUpdate({
         _id: token,
         isDeleted: false
     }, {
        $set:{isDeleted: true}
     }, null, (err, sessions) => {
         if(err) {
             return res.send({
                 success: false,
                 message: 'Error: Server error.'
             });
         }
 
        return res.send({
            success: true,
            message: 'Success'
        });
     });
});

module.exports = router;