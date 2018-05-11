const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

// Add App key, secret and id from your MLab account
let pusher = new Pusher({
    appId: '',
    key: '',
    secret: '',
    cluster: 'eu',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({
        success: true,
        votes: votes
    }))
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    };

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-pool', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });
    });

    return res.json({success: true, message: 'Thank you for voting'});
});


module.exports = router;