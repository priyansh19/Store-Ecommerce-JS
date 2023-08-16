import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
        });
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values: values.join(',')
            }))
        );
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = {
            name, 
            parentCategory, 
            properties: properties.map(p => ({
                name:p.name, 
                values:p.values.split(',')
            })),
        }
        if(editedCategory){
            data._id = editedCategory._id
            await axios.put('/api/categories/', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories/', data);
        }
        setName('');
        setParentCategory("");
        setProperties([]);
        fetchCategories();
    }

    function deleteCategory(category){
        swal.fire({
          title: 'Are you sure?',
          text: `Do you want to delete ${category.name}?`,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Yes, Delete!',
          confirmButtonColor: '#d55',
          reverseButtons: true,
        }).then(async result => {
          if (result.isConfirmed) {
            const {_id} = category;
            await axios.delete('/api/categories?_id='+_id);
            fetchCategories();
          }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'', values:''}];
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValueChange(index, property, newValue) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValue;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        })
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? 'Edit Category' : 'Create New Category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text" 
                        placeholder={'Category Name'} 
                        onChange={ev => setName(ev.target.value)}
                        value={name}/>
                    <select
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                            <option value="0">No parent category</option>
                            {categories.map(category => (
                                <option value={category._id}>{category.name}</option>
                            ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button 
                        type="button" 
                        onClick={addProperty}
                        className="btn-default text-sm mb-1">
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-1">
                            <input 
                                className="mr-1 mb-0" 
                                value={property.name} 
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                type="text" 
                                placeholder="Property name example: (colour)"/>
                            <input 
                                className="mr-1 mb-0" 
                                value={property.values} 
                                onChange={ev => handlePropertyValueChange(index, property, ev.target.value)}
                                type="text" 
                                placeholder="Values comma seperated"/>
                            <button type="button" onClick={() => removeProperty(index)} className="btn-default">Remove</button>
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn-primary">Save</button> 
                {editedCategory && (
                    <button 
                        onClick={() => {
                            setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }} 
                        type="button" 
                        className="btn-secondary">Cancel
                    </button>
                )}
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category.parent?.name}</td>
                                <td>
                                    <button onClick={() => editCategory(category)} className="btn-primary mr-1">Edit</button>
                                    <button
                                        className="btn-primary"
                                        onClick={() => deleteCategory(category)}>
                                            Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default withSwal(({swal}) => (
    <Categories swal={swal}/>
));