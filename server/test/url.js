const bcrypt = require('bcrypt');

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
let Url = require('../models/url');
let Usuario = require('../models/usuario');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let request = require('supertest');

chai.use(chaiHttp);

const userCredentials = {
    email: 'test1@google.com',
    password: '123456'
}

let authenticatedUser = request.agent(server);
let token = '';

before(function(done) {
    authenticatedUser
        .post('/login')
        .send(userCredentials)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end(function(err, response) {
            chai.expect(response.statusCode).to.equal(200);
            chai.expect('Location', '/home');
            token = response.body.token;
            done();
        });
});

//Our parent block
describe('Urls', () => {

    beforeEach((done) => { //Before each test we empty the database
        Url.remove({}, (err) => {
            done();
        }).error((err) => console.log(err));
    });

    /*
     * Test the /GET route
     */
    describe('/GET url', () => {
        it('it should GET all the urls', (done) => {
            chai.request(server)
                .get('/url')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.ok.should.equal(true);
                    res.body.urls.should.be.a('array');
                    res.body.urls.length.should.be.eql(0);
                    done();
                });
        });
    });

});