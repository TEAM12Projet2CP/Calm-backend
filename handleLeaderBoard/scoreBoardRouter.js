
const boardRouter = require('express').Router()

const {getScoreBoard} = require('./scoreboardController')

boardRouter.get('/dashboard', async (req, res) => {
    const result = await getScoreBoard()

    return res.json({list: result})
})

module.exports = boardRouter
