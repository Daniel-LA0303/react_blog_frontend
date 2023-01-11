import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar';

import { Link, useNavigate } from 'react-router-dom';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../components/EditorToolBar/EditorToolBar.css"
import EditorToolBar, { modules, formats } from '../../components/EditorToolBar/EditorToolBar';

import Select from 'react-select'

import { useDispatch, useSelector } from 'react-redux';
import {addNewPostAction, addNewFilePostAction, getAllCategoriesAction } from '../../StateRedux/actions/postAction';

import Spinner from '../../components/Spinner/Spinner';

const NewPost = () => {

  const route = useNavigate();

  //local state
  const[title, setTitle] = useState(''); //title
  const[desc, setDesc] = useState(''); //description
  const[content, setContent] = useState(''); //content
  const[file, setFile] = useState(null); //get file
  const[categoriesPost, setCategoriesPost] = useState([]); //cat that user chose
  const[addPost, setAddPost] = useState(false);

  //redux
  const dispatch = useDispatch();
  const getAllCategoriesRedux = () => dispatch(getAllCategoriesAction());
  const categories = useSelector(state => state.posts.categories);
  const addPostRedux = newPost => dispatch(addNewPostAction(newPost));
  const addNewFileRedux = (formData) => dispatch(addNewFilePostAction(formData));
  const loading = useSelector(state => state.posts.loading);
  const user = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    getAllCategoriesRedux();
  }, []);

  useEffect(() => {
    if(!user._id){
        route('/');
        
    }
}, [user]);


  const onContent = (value) => {
    setContent(value);
  }

  const handleChangeS = (select) => {
    setCategoriesPost(select);
  }
  
  const getFile = e => {
    setFile(e.target.files[0]);
  }

  const newPost = async e => {
    e.preventDefault();

    let cats = [];
    for (let i = 0; i < categoriesPost.length; i++) {
        cats.push(categoriesPost[i].name);
    }

    const newPost = {
        user: user._id,
        title: title,
        content: content,
        categoriesPost: cats,
        categoriesSelect: categoriesPost,
        desc: desc,
    }
    if(file){
        const formData = new FormData();
        const filename = Date.now() + file.name;
        formData.append('name', filename);
        formData.append('image', file);
        newPost.linkImage = filename
        addNewFileRedux(formData);
    }
    addPostRedux(newPost);
    setTimeout(() => {
        route('/');
    }, 500);
    
}

  return (
    <div>
        {loading ? (
            <Spinner />
        ):(
            <>
                {/* <Sidebar />    */}

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
                                    options={categories}
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