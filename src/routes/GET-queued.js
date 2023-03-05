const { router } = require('express');

router
    .route('/queued')
    .get((req,res)=>{
        let session = req.params.session;
        res.send()
    });

module.exports = router;