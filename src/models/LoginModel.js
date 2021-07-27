const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true }
    
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valid();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne( { email: this.body.email} );
        
        //User validation
        if(!this.user) {
            this.errors.push('Usuário inválido.');
            return;
        }

        //Password validation
        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida.');
            this.user = null;
            return;
        }
    }

    async register() {
        this.valid();
        if(this.errors.length > 0) return;

        await this.userExists();

        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        this.user = await LoginModel.findOne( {email: this.body.email} );
        if(this.user) this.errors.push('Usuário já existente.');
    }


    //Valid email and password
    valid() {
        this.cleanUp();

        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        //Password need to be among 3 and 50 characters
        if(this.body.password.length < 3 || this.body.password.length >= 50) {
            this.errors.push('A senha precisa ter de 3 à 50 caracteres.')
        }
    }

    cleanUp() {
        for(const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;