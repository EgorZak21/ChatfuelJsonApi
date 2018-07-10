const mongo =  	require( 'mongoose' );
const Schema = mongo.Schema;

function sphereDist(lat1,lng1,lat2,lng2){
    return(Math.acos(Math.sin(lat1/180*Math.PI)*Math.sin(lat2/180*Math.PI)+Math.cos(lat1/180*Math.PI)*Math.cos(lat2/180*Math.PI)*Math.cos((lng1-lng2)/180*Math.PI))*6371);
}
console.log();

class DbClient {
    constructor(dbloc,googleAPI){
        this.api = googleAPI;
        this.dbloc = dbloc;
        this.places = mongo.model("places",new Schema({
            cid: String,
            name: String,
            address: String,
            lat: Number,
            lng: Number,
            image: String,
            note: String
        }));
    }

    async connect(){
        try{
            await mongo.connect(this.dbloc);
        }catch(e){ throw e; }
        console.log('connected');
    }

    async refresh(doc){
        try{
            let res = await this.api.findPlace(doc.address);
            doc.set({lat: res.geometry.location.lat,
            lng: res.geometry.location.lng,
            cid: res.url});
            await doc.save();
        }catch(e){
            console.dir(e);
        }
    }

    async nearby(lat,lng){
        let client = this;
        let docs  = await client.places.find();
        for(let doc of  docs ){
            if((doc.lat === undefined)||(doc.cid === undefined)){
                await this.refresh(doc);
            }
            doc.radius = sphereDist(lat,lng,doc.lat,doc.lng);
        }
        docs.sort(function (a,b) {
            if(a.radius>b.radius){
                return 1;
            }else if(a.radius === b.radius){
                return -1;
            }else{
                return 0;
            }
        });
        return(docs.slice(0,3));
    }
}

module.exports = DbClient;
