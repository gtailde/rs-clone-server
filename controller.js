const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const { secret } = require("./config");
const checkEmail = require("./checker");

const generateAccessToken = (id, roles) => {
  const payload = {
    id, 
    roles
  };
  return jwt.sign(payload, secret, {expiresIn: "14d"});
};


class controller{
  async registration(req, res){
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({message: "Error during registration", errors});
      }
      const { username, password, name, email} = req.body;
      const candidate = await User.findOne({username});
      if(candidate) {
        return res.status(400).json({message: "A user with that name already exists"});
      };
      let EMAIL = '';
      if(email){
        if(await checkEmail(email)){
          EMAIL = email;
        } else {
          res.status(400).json({message: 'Registration error, email has been used'});
        };
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({value: "USER"});
      console.log(userRole.value)
      const user = new User({username, password: hashPassword, roles: [userRole.value], name: name, email: EMAIL});
      await user.save();
      return res.json({message: "Registration was successful"});
    } catch(err){
      console.log(err);
      res.status(400).json({message: 'Registration error'});
    } 
  };

  async login(req, res){
    try{
      const { username, password, email } = req.body;
      const users = username ? await User.findOne({username}) : await User.findOne({email});
      if(!users){
        return res.status(400).json({message: `User ${users} was not found`});
      };
      const validPassword = bcrypt.compareSync(password, users.password);
      if(!validPassword){
        return res.status(400).json({message: `Invalid password entered`});
      };
      const token = generateAccessToken(users._id, users.roles);
      return res.json({token: token, id: users._id});
    } catch(err){
      console.log(err);
      res.status(400).json({message: 'Login error'});  
    }  
  };

  async getUsers(req, res){
    try{
      const users = await User.find();
      res.json(users);
    } catch(err){
      console.log(err);
    }  
  };

  async getDataFromUser(req, res){
    try{
      const { _id } = req.body;
      const user = await User.findOne({_id});
      if(!user){
        return res.status(400).json({message: `User ${user} was not found`});
      };
      return res.json(user);
    } catch (err){
      return res.status(400).json({message: `Error getting user ${err}`});
    }
  };

  async updateUser(req, res){
    try{
      const { _id, username, password, name, email } = req.body;
      const user = await User.findOne({_id});
      if(!user){
        return res.status(400).json({message: `User with ${_id} was not found`});
      }; 

      if(username){
        user.username = username;
      } else if(email || email === ""){
        if(await checkEmail(email) || email === ""){
          user.email = email;
          console.log('ok')
        } else {
          return res.status(400).json({message: `Email already used. Error update`});
        };
      } else if(password){
        user.password = password;
      } else if(name) {
        user.name = name;
      } else {
        return res.status(400).json({message: `Error user update`});
      };
      await user.save();
      return res.status(200).json({message: "User updated successfully"});
    } catch (err){
      return res.status(400).json({message: `Error user update ${err}`});
    }
  };

  async deleteUser(req, res){
    try {
      const { _id } = req.body;
      const removedUser = await User.findByIdAndRemove(_id);
      if (!removedUser) {
        throw new Error("User not found");
      }
      return res.status(200).json({message: "User delete successfully"});
    } catch (err){
      return res.status(400).json({message: `Error delete user ${err}`});
    }
  };

  async addIMG(req, res){
    try{
      const { _id, type, link} = req.body;
      const user = await User.findOne({_id});
      if(!user){
        return res.status(400).json({message: `User ${users} was not found`});
      };
      if(type === "profile"){
        user.img.profile.imgs.push(link);
      } else {
        user.img.others.imgs.push(link);
      };
      await user.save();
      res.status(200).json({message: 'Image extracted successfully'});  
    } catch(err){
      console.log(err);
      res.status(400).json({message: 'Error adding IMG'});  
    }  
  };

  async deleteIMG(req, res){
    try{
      const { _id, type, link} = req.body;
      const user = await User.findOne({_id});
      if(!user){
        return res.status(400).json({message: `User ${user} was not found`});
      };
      if(user.img.profile.imgs.includes(link) || user.img.others.imgs.includes(link)){
        if(type === "profile"){
          user.img.profile.imgs.splice(user.img.profile.imgs.indexOf(link), 1);
        } else {
          user.img.others.imgs.splice(user.img.others.imgs.indexOf(link), 1);
        };
        await user.save();
        res.status(200).json({message: 'Image delated successfully'});  
      } else {
        res.status(200).json({message: 'Image not found'});  
      };
    } catch(err){
      console.log(err);
      res.status(400).json({message: `Error delete IMG ${err}`});  
    }  
  };

  async check(req, res){
    try {
      return res.status(200).json(true);
    } catch (err){
      console.log(err)
      return res.status(400).json({message: `Error check token ${err}`});
    }
  };

};

module.exports = new controller();