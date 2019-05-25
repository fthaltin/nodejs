const chai =  require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../app');

chai.use(chaiHttp);

let token, movieId;

describe('/api/movies test', () => {
    before((done) => {
        //console.log('ilk ben çalışacam');
        chai.request(server)
            .post('/authenticate')
            .send({username: 'test', password: '12345'})
            .end((err, res) => {
                token = res.body.token
                //console.log(token)
                done();
            })
    })

    describe('GET Movies', () => {
        it('it should get all the movies', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
    })

    describe('/POST Movie', () => {
        it('it should post a movie', (done) => {
            const movie = {
                title:"Usual Suspects",
                category:"Movies",
                year:"1995",
                imdb_score:"9",
                date:"12.12.2015",
                director_id:"5cdd7db1f3acb231acc95a56"
            }
            chai.request(server)
                .post('/api/movies/new')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('category');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('director_id');
                    movieId = res.body._id;
                    done();
                })
        })
    })

    describe('/GET/:movie_id', () => {
        it('It should GET movie details', (done) => {
            chai.request(server)
                .get('/api/movies/'+movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                })
        })
    })
})