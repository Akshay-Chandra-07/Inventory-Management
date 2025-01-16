const formidable = require("formidable");

const parseForm = () => (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (error, fields, files) => {
    if (error) {
      console.log(error);
      return next(error);
    }
    req.body = fields;
    req.files = files;
    next();
  });
};

module.exports = { parseForm };
