const { Question } = require("../models");


class GameController {
  static randomQuestion (req, res, next) {
    Question.findAll()
      .then(questions => {
        res.status(200).json(questions)
      })
      .catch(err => console.log(err))
  }
}

module.exports = GameController