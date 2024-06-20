import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar';

import { Link, useNavigate } from 'react-router-dom';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../components/EditorToolBar/EditorToolBar.css"
import EditorToolBar, { modules, formats } from '../../components/EditorToolBar/EditorToolBar';

import Select from 'react-select'

import { useDispatch, useSelector } from 'react-redux';
import {addNewPostAction } from '../../StateRedux/actions/postAction';

import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';
import axios from 'axios';
import usePages from '../../context/hooks/usePages';

const NewPost = () => {

  const {pageAllCategories, getAllCategories, loadingPage, user} = usePages();

  let resImage = {} //-> String res from Cloudinary
  let cats = []; //-> Array of categories for select 

  const route = useNavigate();

  //local state
  const[title, setTitle] = useState(''); //title
  const[desc, setDesc] = useState(''); //description
  const[content, setContent] = useState(''); //content
  const[file, setFile] = useState(null); //get file
  const[categoriesPost, setCategoriesPost] = useState([]); //cat that user chose

  //redux
  const dispatch = useDispatch();
//   const getAllCategoriesRedux = () => dispatch(getPageNewPostAction());
  const addPostRedux = (newPost, newPostRedux) => dispatch(addNewPostAction(newPost, newPostRedux));
//   const loading = useSelector(state => state.posts.loading);
//   const loadingPost = useSelector(state => state.posts.loadingPost);
//   const msgPost = useSelector(state => state.posts.msgPost);
//   const user = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
//   const categories = useSelector(state => state.posts.pageNewPost.categories);
  
  useEffect(() => {
    setTimeout(() => {
      if(Object.keys(pageAllCategories).length === 0){
        getAllCategories(); //-> we use the same function to get the categories for the select
      }
    }, 500);
    // getAllCategoriesRedux();
}, []);

  //content post
  const onContent = (value) => {
    setContent(value);
  }

  //select categories
  const handleChangeS = (select) => {
    setCategoriesPost(select);
  }
  
  //get file
  const getFile = e => {
    setFile(e.target.files[0]);
  }

  //build obj
  const createObj = () => {
    const newDate = Date.now()
    const newPost = {
        user: user._id,
        title: title,
        content: content,
        categoriesPost: cats,
        categoriesSelect: categoriesPost,
        desc: desc,
        date: newDate
    }
    return newPost;
}

  const newPost = async e => {
    e.preventDefault();
    
    //validate
    if([title, desc, content, categoriesPost].includes('')){
        Swal.fire(
            "All fields are required",
        )
        return;
    }
    //validate file
    if(file === null){
        Swal.fire(
            "All fields are required",
        )
        return;
    }

    cats = categoriesPost.map(category => category.name);

    //create obj
    const newPost = createObj();
    
    if(file){
        //Build the form data for the image
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(`${link}/posts/image-post`, formData);
            resImage = res.data; //-> we get the res from Cloudinary
            console.log(res);
        } catch (error) {
            //catch errors
            //we can do a file validation here with switch and status
            if (error.response) {
        
                console.log(error.response.status); 
                console.log(error.response.data);   
                //here we can send a message in a modal or alert
                if (error.response.status === 404) {
                    console.log("User not found");
                } else if (error.response.status === 500) {
                    console.log("Internal Server Error");
                } else {
                    console.log("Unexpected error");
                }
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        }
        newPost.linkImage = resImage
    }
    
    //add post with redux
    addPostRedux(newPost);

    setTimeout(() => {
        route('/');
    }, 500);

}

  return (
    <div>
        {loadingPage ? (
            <Spinner />
        ):(
            <>
                <Sidebar />   

            <div className=" w-5/6  mx-auto my-20  ">
            <div className='flex justify-start'>
                <Link to='/' class="text-center w-full sm:w-auto focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Cancel</Link>
            </div>
            <form 
                className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'}  bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4`}
                onSubmit={newPost}
            >
                <div className="bg-white p-5 block sm:flex justify-between w-full rounded">
                    <div className="w-full sm:w-3/6">
                        <div className="mb-2 w-full ">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Title
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="username" 
                                type="text" 
                                placeholder="Title" 
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </div>
                        <div className="mb-2 w-full ">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Description
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="username" 
                                type="text" 
                                placeholder="Description" 
                                onChange={(e) => setDesc(e.target.value)}
                                value={desc}
                            />
                        </div>
                        <div className="mb-4 w-full text-black">
                                <label  className="block text-gray-700 text-sm font-bold mb-2">Select an option</label>
                                <Select 
                                    onChange={handleChangeS}
                                    options={pageAllCategories}
                                    isMulti 
                                />
                        </div>
                    </div>

                    <div className="mb-4 w-full sm:w-2/5">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Image
                        </label>
                        <input 
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                            id="file_input" 
                            type="file" 
                            onChange={getFile}
                        />
                        <div className='my-2'>
                            {file && 
                                <img
                                className="img-preview"
                                src={URL.createObjectURL(file)}
                                alt=""
                                />
                            }
                        </div>
                    </div>
                </div>

                <div className="mb-4 bg-white p-4 text-black">
                    <EditorToolBar toolbarId={'t1'}/>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={onContent}
                        placeholder={"Write something awesome..."}
                        modules={modules('t1')}
                        formats={formats}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <input 
                        className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        value='Add Post'
                        type="submit" 
                    />
                </div>
            </form>
        </div>
            </>
        )}

    </div>
  )
}

export default NewPost