const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const serveStatic = require('serve-static');



const appRouter = require('./router');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/basicRouts', appRouter);
app.post('/upload', appRouter)

app.use(serveStatic(path.join(__dirname, 'public/uploads')));

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ msg: err });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ msg: 'Error: No File Selected!' });
      } else {
        res.send({ msg: 'File Uploaded!', file: `http://localhost:5000/${req.file.filename}` });
      }
    }
  });
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const start = async () => {
  try{
    await mongoose.connect('mongodb+srv://Rs-clone:23102004@rs-clone.kfx87tb.mongodb.net/Rs-clone?retryWrites=true&w=majority');
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  }catch (err){
    console.log(err);
  };
};



start();

module.exports = app;