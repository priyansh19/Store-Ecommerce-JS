import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DeleteProductPage() {
    const [productInfo, setProductInfo] = useState();
    const router = useRouter();
    const {id} = router.query;

    function goBack() {
        router.push('/products')
    }

    async function deleteProduct() {
        await axios.delete('/api/products?id='+id);
        goBack();
    }

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(response =>{
            setProductInfo(response.data);
        });
    }, [id]);


    
    return(
        <Layout>
            <h3>Do you really want to delete &nbsp;&quot{productInfo?.title}&quot ?</h3>
            <div className="flex gap-1">
                <button onClick={deleteProduct} className="btn-secondary">Yes</button>
                <button onClick={goBack} className="btn-primary">No</button>
            </div>
        </Layout>
    );
}