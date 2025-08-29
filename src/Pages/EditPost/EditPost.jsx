import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar'

import { useSelector } from 'react-redux';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../components/EditorToolBar/EditorToolBar.css"
import EditorToolBar, { modules, formats } from '../../components/EditorToolBar/EditorToolBar';

import Select from 'react-select'
import axios from 'axios';

import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useSwal } from '../../hooks/useSwal';
import clientAuthAxios from '../../services/clientAuthAxios';


const EditPost = () => {

    /**
     * hooks
     */
    const { showAutoSwal, showConfirmSwal } = useSwal();


    /**
     * route
     */
    const route = useNavigate();
    const params = useParams();

    /**
     * states
     */
    const [title, setTitle] = useState(''); //title
    const [desc, setDesc] = useState(''); //description
    const [categoriesSelect, setCategoriesSelect] = useState([]); //cats of post
    const [content, setContent] = useState(''); //content
    const [image, setImage] = useState(''); //image
    const [file, setFile] = useState(null); //get new image
    const [newImage, setNewImage] = useState(false); //new image validation
    const [categories, setCategories] = useState([]); //categories
    const [loading, setLoading] = useState(false);

    const [prevImagePublicId, setPrevImagePublicId] = useState(null); // guarda el public_id de la imagen anterior
    const [removeImage, setRemoveImage] = useState(false); // marca que el usuario quiso quitar la imagen



    const inputRef = useRef(null);

    /**
     * states Redux
     */
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const userP = useSelector(state => state.posts.user);

    /**
     * useEffect
     */
    useEffect(() => {

        setLoading(true);
        clientAuthAxios.get(`${link}/pages/page-edit-post/${params.id}`)
            .then((response) => {
                console.log(response);

                // set all info
                setCategories(response.data.data.categories); //categories
                setTitle(response.data.data.post.title); // title
                setContent(response.data.data.post.content); // content
                setImage(response.data.data.post.linkImage); // linkImage

                setPrevImagePublicId(response.data.data.post.linkImage?.public_id || null);

                // insert cats selected
                const allCategories = response.data.data.categories; 
                const postCategories = response.data.data.post.categories.map(cat => ({
                    value: cat.value || cat.name, 
                    label: cat.label || cat.name
                }));

                const selected = allCategories.filter(opt =>
                    postCategories.some(cat => cat.value === opt.value)
                );

                setCategoriesSelect(selected);

                setDesc(response.data.data.post.desc); // description
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
            .catch((error) => {
                const msg = error.response?.data?.message
                console.log(error);
                if (error.code === 'ERR_NETWORK') {
                    const data = {
                        error: true,
                        message: {
                            status: null,
                            message: 'Network Error',
                            desc: null
                        }
                    }
                    setLoading(false);
                    route('/error', { state: data });
                } else {
                    showConfirmSwal({
                        message: msg,
                        status: "error",
                        confirmButton: true
                    })
                    setLoading(false);
                    route('/error', { state: data });
                }
            })
    }, [params.id]);

    // get content
    const onContent = (value) => {
        setContent(value);
    }

    // get categories
    const handleChangeS = (select) => {
        setCategoriesSelect(select);
    }

    // get file 
    const getFile = e => {
        setFile(e.target.files[0]);
        setNewImage(true) //user chose new image
    }

    const newPost = async e => {

        e.preventDefault();

        // 1. validate data
        if ([title, desc, content].includes('')) {
            showConfirmSwal({
                message: "All fields are required",
                status: "warning",
                confirmButton: true
            })
            return;
        }

        // 2. validate number of categories selected
        if (categoriesSelect.length > 4) {
            showConfirmSwal({
                message: "Please choose between 1 - 4 categories",
                status: "warning",
                confirmButton: true
            })
            return;
        }

        // 3. assamble info
        let resImage = {} // image
        let linkImage; // link image

        // 4. we mapping categories
        let cats = [];
        for (let i = 0; i < categoriesSelect.length; i++) {
            cats.push(categoriesSelect[i].name);
        }

        // 5. new data updated
        const postUpdate = {
            title: title,
            content: content,
            categoriesPost: cats,
            categoriesSelect: categoriesSelect,
            desc: desc
        }

        // 6. delete or not the image
        if (newImage) {
            // previousName = id of the previous image (if it exists)
            postUpdate.previousName = prevImagePublicId || null;

            // upload new image (if there is a file) and assign linkImage with the Cloudinary result
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                const res = await clientAuthAxios.post(`${link}/posts/image-post`, formData);
                postUpdate.linkImage = res.data; // assuming res.data contains { public_id, secure_url }
            }
        }
        // if the user removed the image without replacing it
        else if (removeImage) {
            postUpdate.previousName = prevImagePublicId; // id to delete from Cloudinary
            postUpdate.linkImage = null;                 // leave the post in DB without an image
        }
        // if the user keeps the same image
        else {
            postUpdate.linkImage = image; // can be null or the object {public_id, secure_url}
        }

        // 7. if there is a file we new insert the new image in backend
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await clientAuthAxios.post(`${link}/posts/image-post`, formData); // insert new inmage in service cloudinary
                resImage = res.data
                console.log(resImage);
            } catch (error) {
                console.log(error);
            }

            // we have new link to updated
            postUpdate.linkImage = resImage
            linkImage = resImage
        }

        try {

            // 8. finally we update new info in backend
            const response = await clientAuthAxios.put(`${link}/posts/${params.id}`, postUpdate);

            showAutoSwal({
                message: response.data.message,
                status: "success",
                timer: 1500
            });
            route('/');
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || "Error inesperado";
            showConfirmSwal({
                message: msg,
                status: "error",
                confirmButton: true
            })
        }

    }

    const quitImage = (e) => {
        e?.preventDefault?.();

        // if there was a local file (not yet uploaded to Cloudinary)
        if (file) {
            setFile(null);
            setNewImage(false);
            return;
        }

        // if there was already an uploaded image (object with public_id)
        if (image?.public_id) {
            const id = image.public_id;        // capture the id BEFORE clearing the UI
            setPrevImagePublicId(id);          // store it in state to send later
            setRemoveImage(true);              // mark that it should be deleted
            setImage(null);                    // update UI (remove preview)
            setNewImage(false);
        }
    };




    return (
        <div>
            {
                loading ? <Spinner /> : (
                    <>
                        <Sidebar />
                        <main className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="space-y-8">
                                <div
                                    className={`${theme ? 'text-black' : 'text-white'}`}
                                >
                                    <h2 className="text-3xl font-extrabold tracking-tight ">Edit your post</h2>
                                    <p className="mt-2 text-lg text-[var(--secondary-text-color)]">
                                        Fill out the form below to publish a new masterpiece.
                                    </p>
                                </div>

                                <form
                                    className={`${theme ? 'bgt-light text-black' : 'bgt-dark text-white'} rounded-lg p-6 shadow-sm sm:p-8`}
                                    onSubmit={newPost}
                                >
                                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                                        {/* Left column: Title, Description, Category */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium" htmlFor="title">Title *</label>
                                                <div className="mt-1">
                                                    <input
                                                        className="p-2 rounded-sm w-full text-black"
                                                        id="title"
                                                        name="title"
                                                        type="text"
                                                        placeholder="e.g. My Awesome Post"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium" htmlFor="description">Description *</label>
                                                <div className="mt-1">
                                                    <input
                                                        className="p-2 rounded-sm w-full text-black"
                                                        id="description"
                                                        name="description"
                                                        type="text"
                                                        placeholder="A short and sweet description."
                                                        value={desc}
                                                        onChange={(e) => setDesc(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium " htmlFor="category">Category (Max 4 Categories)</label>
                                                <div className="mt-1 text-black">
                                                    <Select
                                                        value={categoriesSelect}
                                                        onChange={handleChangeS}
                                                        options={categories}
                                                        isMulti
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <label className="block text-sm font-medium" htmlFor="file_input">
                                                Featured Image
                                            </label>
                                            {
                                                file || image?.secure_url ? (
                                                    <div className="my-2 relative w-max mx-auto">
                                                        <img
                                                            src={file ? URL.createObjectURL(file) : image.secure_url}
                                                            alt="Preview"
                                                            className="mx-auto max-h-48 rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={quitImage}

                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            <p>X</p>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => inputRef.current.click()}
                                                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-6 hover:border-gray-500 transition-colors bg-gray-50"
                                                    >
                                                        <FontAwesomeIcon icon={faImage} size="8x" className="text-gray-700" />
                                                        <span className="text-gray-500 text-sm">
                                                            Click to upload your image
                                                        </span>
                                                        <input
                                                            type="file"
                                                            ref={inputRef}
                                                            className="hidden"
                                                            onChange={getFile}
                                                        />
                                                    </div>
                                                )
                                            }



                                        </div>

                                        {/* Content area */}
                                        <div className="md:col-span-2 mt-6">
                                            <label className="block text-sm font-medium " htmlFor="content">Content *</label>
                                            <div className="mt-1 bg-white  text-black rounded">
                                                <EditorToolBar toolbarId="t1" />
                                                <ReactQuill
                                                    theme="snow"
                                                    value={content}
                                                    onChange={onContent}
                                                    placeholder="Write something awesome..."
                                                    modules={modules("t1")}
                                                    formats={formats}
                                                    style={{ minHeight: '400px' }}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Submit button */}
                                    <div className="flex justify-between pt-8 gap-4">
                                        <button
                                            type="button"
                                            className="text-black flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-md bg-white px-4 text-sm font-semibold hover:bg-gray-400"
                                            onClick={() => route(-1)}
                                        >
                                            <span className="truncate">Cancel</span>
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-theme-light-op1 hover:bg-blue-700 flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold text-white shadow-sm"
                                        >
                                            <span className="truncate">Update</span>
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </main>

                    </>
                )
            }
        </div>
    )
}

export default EditPost