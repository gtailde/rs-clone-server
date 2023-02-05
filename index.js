const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./authRouter');

const PORT = process.env.PORT || 5000;


// mongodb+srv://Rs-clone:<password>@rs-clone.kfx87tb.mongodb.net/?retryWrites=true&w=majority
const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
  try{
    
    await mongoose.connect('mongodb+srv://Rs-clone:23102004@rs-clone.kfx87tb.mongodb.net/Rs-clone?retryWrites=true&w=majority');
    
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  }catch (err){
    console.log(err);
  };
};
start();