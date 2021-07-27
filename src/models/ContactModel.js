const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
        this.body = body;
        this.errors = [];
        this.contact = null;
    }

    Contact.prototype.register = async function() {
        this.valid();
        if(this.errors.length > 0) return;
        this.contact = await ContactModel.create(this.body);
    }

    //Validation
    Contact.prototype.valid = function() {  
        this.cleanUp();

        //email validation
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido');
        if(!this.body.nome) this.errors.push('Nome é um campo obrigatório');
        if(!this.body.email && !this.body.telefone) {
            this.errors.push('Email ou telefone precisam ser preenchidos.');
        }
    }

    Contact.prototype.cleanUp = function() {
        for(const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        };
    };

    Contact.prototype.edit = async function(id) {
        if(typeof id !== 'string') return;
        this.valid();
        if(this.errors.length > 0) return;
        this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
    };

    //Static methods
    Contact.idSearcher = async function(id) {
        if(typeof id !== 'string') return;
        this.contact = await ContactModel.findById(id);
        return this.contact;
    }

    Contact.contactSearcher = async function() {
        const contactList = await ContactModel.find()
            .sort( { createdAt: -1} );
        return contactList;
    }

    Contact.delete = async function(id) {
        if(typeof id !== 'string') return;
        const contact = await ContactModel.findByIdAndDelete({_id: id})
        return contact;
    }

module.exports = Contact;