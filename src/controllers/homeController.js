const Contact = require('../models/ContactModel');

exports.index = async (req, res) => {
    const contactList = await Contact.contactSearcher();
    res.render('index', {contactList} );
};



