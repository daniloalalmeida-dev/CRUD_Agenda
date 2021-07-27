const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('logged');
    res.render('login');
};

exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        //check if we got any error message
        if(login.errors.length > 0) {
            req.flash('errors', login.errors); //so, present the errors using 'flash'
            req.session.save(function() { //save the session and back through the call back function
                return res.redirect('back'); //login page
            });
            return; //return again to close the validation
        }

        //the same validation for the sucess
        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.save(function() {
            return res.redirect('back');
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        //check if we got any error message
        if(login.errors.length > 0) {
            req.flash('errors', login.errors); //so, present the errors using 'flash'
            req.session.save(function() { //save the session and back through the call back function
                return res.redirect('back'); //login page
            });
            return; //return again to close the validation
        }

        //the same validation for the sucess
        req.flash('success', 'Usuário logado com sucesso.');
        req.session.user = login.user;
        req.session.save(function() {
            return res.redirect('back');
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/login/index');
};