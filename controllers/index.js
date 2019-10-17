// dependencies
// ============
const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// root route
router.get('/', function(req, res) {
    Article
        .find({})
        .where('saved').equals(false)
        .where('deleted').equals(false)
        .sort('-date')
        .limit(20)
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let handlebarsObj = {
                    title: 'Scraping News Articles Headliners!',
                    subtitle: 'Washington Post Scraper News Edition',
                    articles: articles
                };
                res.render('index', handlebarsObj);
            }
        });
});

// saved articles
router.get('/saved', function(req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .sort('-date')
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let handlebarsObj = {
                    title: 'Scraping News Articles Headliners!',
                    subtitle: 'Saved Scraped News',
                    articles: articles
                };
                res.render("saved" ,handlebarsObj);
            }
        });
});

// require controllers
router.use('/api', require('./api'));

module.exports = router;