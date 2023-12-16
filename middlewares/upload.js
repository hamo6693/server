const multer = require("multer")

const DIR = "./public/images"

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
      cb(null,DIR)
    },
    filename: (req, file, cb) => {
      //للحصول على صيغة الصور تلقائيا
      let extArray = file.mimetype.split("/")
      //للحصول على اسم الصيغة دون اسم الملف
      let extension = extArray[1]
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + "." + extension)
    }
  })
  
  const upload = multer({ 
    storage: storage,
    limits:{fieldSize: 25 * 1024 * 1024},
    //
    fileFilter:(req,file,cb) => {
      if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null,true)
      } else{
        cb(new multer.MulterError("not a picture"))
      }
    } 
  })

  module.exports = upload;
  