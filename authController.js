const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id, 
    roles
  };
  return jwt.sign(payload, secret, {expiresIn: "14d"});
};


class authController{
  async registration(req, res){
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({message: "Error during registration", errors});
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({username});
      if(candidate) {
        return res.status(400).json({message: "A user with that name already exists"});
      };
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({value: "USER"});
      console.log(userRole.value)
      const user = new User({username, password: hashPassword, roles: [userRole.value]});
      await user.save();
      return res.json({message: "Registration was successful"});
    }catch(err){
      console.log(err);
      res.status(400).json({message: 'Registration error'});
    } 
  };

  async login(req, res){
    try{
      const { username, password } = req.body;
      const users = await User.findOne({username});
      if(!users){
        return res.status(400).json({message: `User ${users} was not found`});
      };
      const validPassword = bcrypt.compareSync(password, users.password);
      if(!validPassword){
        return res.status(400).json({message: `Invalid password entered`});
      };
      const token = generateAccessToken(users._id, users.roles);
      return res.json(token);
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
};

module.exports = new authController();