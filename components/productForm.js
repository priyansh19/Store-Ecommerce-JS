import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    console.log(_id);
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title,description,price,images};
        if(_id){
            await axios.put('/api/products', {...data,_id});
        } else {
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if(goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for(const file of files){
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    return (
        <form onSubmit={saveProduct}>
            
            <label>Product Name</label><br/>
            <input 
                type="text"
                placeholder="Product Name" 
                value={title} 
                onChange={event => setTitle(event.target.value)}/><br/>
            <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                        {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 rounded-sm">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                        ))}
                </ReactSortable>
                    {isUploading && (
                        <div className="w-24 h-24 p-1 bg-gray-200 flex flex-wrap justify-center items-center rounded-lg">
                            <Spinner/>
                        </div>
                    )}
                    <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-gray-500 gap-1 rounded-lg bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                        </svg>
                        <div>
                            Upload
                        </div>
                            <input type="file" onChange={uploadImages} className="hidden"/>
                    </label>
                </div>
            <label>Description</label><br/>
            <textarea 
                placeholder="Description of Product"
                value={description} 
                onChange={event => setDescription(event.target.value)}/><br/>
            <label>Price (in Rs.)</label><br/>
            <input 
                type="Number" 
                placeholder="Price"
                value={price} 
                onChange={event => setPrice(event.target.value)}/><br/>
            <button 
                type="submit"
                className="btn-primary">
                    Save
            </button>
        </form>
    );
}