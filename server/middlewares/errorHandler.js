const errorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    let errors = []
    err.errors.forEach(el => {
      errors.push(el.message)
    })
    res.status(400).json({
      message: err.message,
      details: errors
    })
  } else {
    res.status(500).json({ err: err.message })
  }
}

module.exports = errorHandler