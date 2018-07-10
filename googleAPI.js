const Request  = require('request-promise-native');

class googleAPI{
    constructor(token){
        this.token = token;
    }

    async findPlace(name){
        let res;
        try{
            res = await Request.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURI(name)}&key=${this.token}`);
            res =  await Request.get(`https://maps.googleapis.com/maps/api/place/details/json?key=${this.token}&placeid=${JSON.parse(res).results[0].place_id}`);
        }catch (e){
            console.log(e);
        }
        return(JSON.parse(res).result);
    }
}

module.exports = googleAPI;