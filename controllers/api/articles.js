const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const Article = require('../../models/article');
const axios = require('axios');
var request = require('request');
     
// get all 
router.get('/', function(req, res) {
    Article.find({})
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get saved 
router.get('/saved', function(req, res) {
    Article.find({}).where('saved').equals(true).where('deleted').equals(false).populate('notes')
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get deleted 
router.get('/deleted', function(req, res) {
    Article.find({}).where('deleted').equals(true)
        .exec(function(error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// post save id
router.post('/save/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id, {
        $set: { saved: true}
        },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

// delete id
router.delete('/dismiss/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true } },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

// delete an id
router.delete('/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true} },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/saved');
            }
        }
    );
});

// scrape all articles
router.get('/scrape', function(req, res, next) {

    axios.get("https://www.nytimes.com/").then(function (response) {
        //console.log(response);
    //load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(html);
        var $ = cheerio.load(response.data);
        $('tr.athing td.title').each(function(i, e) {
            // Save text of the element in a "title" variable
            let title = $(this).children('a').text();
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH" + title);
            let link = $(this).children('a').attr('href');
            let single = {};
            if (link !== undefined && link.includes('https') &&  title !== '') {
                single = {title: title, link: link};
                let entry = new Article(single);
                entry.save(function(err, doc) {
                    if (err) {
                        if (!err.errors.link) {
                            console.log(err);
                        }
                    } else {
                        console.log('Added a new Article');
                        
                    }
                });
            }
        });
        next();
    });
}, function(req, res) {
    res.redirect('/');
});

module.exports = router;