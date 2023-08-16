import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    
    if (method === 'GET'){ 
        res.json(await Category.find().populate('parent'));
    }
    
    if (method === 'PUT') {
        const {name,parentCategory,properties,_id} = req.body;
        const categoryDoc = await Category.updateOne({_id},{
          name,
          parent: parentCategory || undefined,
          properties: properties,
        });
        res.json(categoryDoc);
    }

    if (method === 'POST'){
        const {name,parentCategory,properties} = req.body;
        const categoryDocument = await Category.create({
            name, 
            parent: parentCategory || undefined,
            properties: properties,
        });
        res.json(categoryDocument);
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }

}