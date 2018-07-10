module.exports = function (app,DBClient) {
    app.post('/places',(req,res)=>{
        DBClient.nearby(req.body.latitude,req.body.longitude).then((docs)=>{
            let messages = [];
            for(let docc  of docs ){
                let doc = docc._doc;
                let buttons = [];
                buttons[0] = {
                    type : "web_url",
                    url : doc.cid,
                    title : 'Google Maps'
                };
                if(doc.phone){
                    buttons[1] = {
                        type:"phone_number",
                        phone_number: doc.phone,
                        title:'Забронировать'
                    }
                }
                buttons[buttons.length] = {
                    type: "show_block",
                    block_names: ['Main-Menu'],
                    title: "Главное меню"
                };
                messages[messages.length] = {
                    title: doc.name,
                    subtitle :`${doc.address} ${(doc.note)?`\n${doc.note}`:''}`,
                    image_url : doc.image,
                    buttons: buttons
                };

            }
            res.send({
                messages: [
                    {
                        attachment:{
                            type:"template",
                            payload:{
                                template_type:"generic",
                                image_aspect_ratio: "square",
                                elements: messages
                            }
                        }
                    }
                ]
            });
        }).catch((e)=>{
            console.dir(e);
            res.send({
                error: 'Something goes wrong'
            });
        });
    });
    app.get('/places',(req,res)=>{
        DBClient.nearby(req.query.latitude,req.query.longitude).then((docs)=>{
            let messages = [];
            for(let docc  of docs ){
                let doc = docc._doc;
                let buttons = [];
                buttons[0] = {
                    type : "web_url",
                    url : doc.cid,
                    title : 'Google Maps'
                };
                if(doc.phone){
                    buttons[1] = {
                        type:"phone_number",
                        phone_number: doc.phone,
                        title:'Забронировать'
                    }
                }
                buttons[buttons.length] = {
                    type: "show_block",
                    block_names: ['Main-Menu'],
                    title: "Главное меню"
                };
                messages[messages.length] = {
                    title: doc.name,
                    subtitle :`${doc.address} ${(doc.note)?`\n${doc.note}`:''}`,
                    image_url : doc.image,
                    buttons: buttons
                };

            }
            res.send({
                messages: [
                    {
                        attachment:{
                            type:"template",
                            payload:{
                                template_type:"generic",
                                image_aspect_ratio: "square",
                                elements: messages
                            }
                        }
                    }
                ]
            });
        }).catch((e)=>{
            console.dir(e);
            res.send({
                error: 'Something goes wrong'
            });
        });
    });
};