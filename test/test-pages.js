// const config  = require('../config/config');
// const expect  = require('chai').expect;
// const request = require('request');

// describe('Load main pages', function() {  
// 	describe('Page status test', function() {
// 		it('Login page returns status code 200', function() {
// 				request(config.baseUrl+'/login/' , function(error, response, body) {
// 						expect(response.statusCode).to.equal(200);
// 						done();
// 				});
// 		});

// 		it('Register page returns status code 200', function() {
// 				request(config.baseUrl+'/register/' , function(error, response, body) {
// 						expect(response.statusCode).to.equal(200);
// 						done();
// 				});
// 		});

// 		it('Forgot Password page returns status code 200', function() {
// 				request(config.baseUrl+'/forgotpwd/' , function(error, response, body) {
// 						expect(response.statusCode).to.equal(200);
// 						done();
// 				});
// 		});

// 		it('Missing pages return status code 404', function() {
// 				request(config.baseUrl+'/aboutus/' , function(error, response, body) {
// 						expect(response.statusCode).to.equal(404);
// 						done();
// 				});
// 		});
// 	});
// });