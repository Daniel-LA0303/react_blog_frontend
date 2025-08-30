import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar';

import { Link, useNavigate } from 'react-router-dom';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../components/EditorToolBar/EditorToolBar.css"
import EditorToolBar, { modules, formats } from '../../components/EditorToolBar/EditorToolBar';

import Select from 'react-select'

// import { Image } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';
import axios from 'axios';
import usePages from '../../context/hooks/usePages';
import Error from '../../components/Error/Error';
import clientAuthAxios from '../../services/clientAuthAxios';
import { newPostAction } from '../../StateRedux/actions/postsActions';
import { useSwal } from '../../hooks/useSwal.js';
import { faImage } from '@fortawesome/free-solid-svg-icons';


const NewPost = () => {

    /**
     * context
     */
    const { errorPage, setErrorPage } = usePages();
    const { error, message } = errorPage;

    /**
     * hooks
     */
    const { showAutoSwal, showConfirmSwal } = useSwal();

    /**
     * router
     */
    const route = useNavigate();

    /**
     * states
     */
    const [title, setTitle] = useState(''); //title
    const [desc, setDesc] = useState(''); //description
    const [content, setContent] = useState(''); //content
    const [file, setFile] = useState(null); //get file
    const [categoriesPost, setCategoriesPost] = useState([]); //cat that user chose
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const inputRef = useRef(null);

    /**
     * states Redux
     */
    const user = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const token = useSelector(state => state.posts.token);

    const dispatch = useDispatch();
    const newPostRedux = (newPost, route) => dispatch(newPostAction(newPost, route));

    /**
     * useEffect
     */
    useEffect(() => {
        setLoading(true);
        axios.get(`${link}/pages/page-new-post`)
            .then((cats) => {
                setCategories(cats.data.categories);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                if (error.code === 'ERR_NETWORK') {
                    setErrorPage({
                        error: true,
                        message: {
                            status: null,
                            message: 'Network Error',
                            desc: null
                        }
                    });
                    setLoading(false);
                } else {
                    setErrorPage({
                        error: true,
                        message: {
                            status: error.response.status,
                            message: error.message,
                            desc: error.response.data.message
                        }
                    });
                    setLoading(false);
                }
            })
    }, []);

    useEffect(() => {
        setErrorPage({
            error: false,
            message: {}
        });
    }, []);


    /**
     * functions
     */
    const onContent = (value) => {
        setContent(value);
    }

    const handleChangeS = (select) => {
        setCategoriesPost(select);
    }

    const getFile = e => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const newPost = async e => {
        e.preventDefault();

        // 1. validate data
        if ([title, desc, content, categoriesPost].includes('')) {
            showConfirmSwal({
                message: "All fields are required",
                status: "warning",
                confirmButton: true
            })
            return;
        }

        if (categoriesPost.length > 4) {
            showConfirmSwal({
                message: "Please choose between 1 - 4 categories",
                status: "warning",
                confirmButton: true
            })
            return;
        }

        // 2. validate img
        // if (file === null) {
        //     showConfirmSwal({
        //         message: "Image are requiered",
        //         status: "warning",
        //         confirmButton: true
        //     })
        //     return;
        // }

        // 3. preparate data
        let resImage = {}
        let linkImage;
        let catsIds = [];

        // 4. get ids categories
        for (let i = 0; i < categoriesPost.length; i++) {
            catsIds.push(categoriesPost[i]._id);
        }

        // 5. assamble data
        const newDate = Date.now()
        const newPost = {
            // user: user._id,
            user: user._id,
            title: title,
            content: content,
            categories: catsIds,
            desc: desc,
            date: newDate
        }

        // 6. upload image
        if (file) {

            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await clientAuthAxios.post(`/posts/image-post`, formData);
                resImage = res.data

            } catch (error) {
                console.log(error);
            }
            newPost.linkImage = resImage
            linkImage = resImage
        }

        // 7. we create the post with the image link if it exists
        dispatch(newPostRedux(newPost, route));
        // setTimeout(() => {
        //     route('/');
        // }, 500);
    }

    const quitImage = () => {
        if (file) setFile(null);
    }

    return (
        <div>
            {error ? <Error message={message} /> :
                loading && !error ? (
                    <Spinner />
                ) : (
                    <>
                        <Sidebar />

                        <main className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="space-y-8">
                                <div
                                    className={`${theme ? 'text-black' : 'text-white'}`}
                                >
                                    <h2 className="text-3xl font-extrabold tracking-tight ">Create a new post</h2>
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
                                                <label className="block text-sm font-medium" htmlFor="title">Title</label>
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
                                                <label className="block text-sm font-medium" htmlFor="description">Description</label>
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
                                                file ?
                                                    <div className="my-2 relative w-max mx-auto">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="Preview"
                                                            className="mx-auto max-h-48 rounded"
                                                        />
                                                        <button
                                                            onClick={quitImage}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h- flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            <p>X</p>
                                                        </button>
                                                    </div>
                                        :
                                        <div
                                            onClick={() => inputRef.current.click()}
                                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-6 hover:border-gray-500 transition-colors bg-gray-50"
                                        >
                                            {/* <Image className="text-gray-400 mb-2" style={{ fontSize: 48 }} />here */}
                                            <FontAwesomeIcon icon={faImage} size='8x' className=' text-gray-700'/>
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
                                            }


                                    </div>

                                    {/* Content area */}
                                    <div className="md:col-span-2 mt-6">
                                        <label className="block text-sm font-medium " htmlFor="content">Content</label>
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
                                    <span className="truncate">Save</span>
                                </button>
                            </div>

                        </form>
                    </div>
        </main>
                    </>
                )}
        </div >
    )
}

export default NewPost