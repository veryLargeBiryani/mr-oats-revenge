const { router } = require('express');

router
    .route('/skip')
    .get((req,res)=>{
        let session = req.params.session;
        sessionDir.get(session).skip();
        res.send('Song skipped!');
    });

module.exports = router;