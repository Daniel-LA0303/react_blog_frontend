import axios from 'axios';
import React, { useEffect, useState } from 'react'

import Sidebar from '../../components/Sidebar/Sidebar'

import { useParams, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { addNewFileUserAction } from '../../StateRedux/actions/postAction';

import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';

const EditProfile = () => {
    const dispatch = useDispatch();

    const params = useParams();
    const route = useNavigate();

    const user = useSelector(state => state.posts.user);
    const addNewFileRedux = (dataFile) => dispatch(addNewFileUserAction(dataFile));
    const PF = useSelector(state => state.posts.PFLink);
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    const[desc, setDesc] = useState('');
    const[work, setWork] = useState('');
    const[education, setEducation] = useState('');
    const[skills, setSkills] = useState('');
    const[image, setImage]= useState({}); //image
    const[file, setFile] = useState(null); //get new image
    const[newImage, setNewImage] = useState(false); //new image validation

    useEffect(() => {
        const getOneUser = async() => {
            try {
                const res = await axios.get(`${link}/users/get-profile/${params.id}`);
                setDesc(res.data.info.desc);
                setWork(res.data.info.work);
                setEducation(res.data.info.education);
                setSkills(res.data.info.skills);
                setImage(res.data.profilePicture);
            } catch (error) {
                console.log(error);  
            }
        }
        getOneUser();
    }, []);
    
    const getFile = e => {
        setFile(e.target.files[0]);
        setNewImage(true) //user chose new image
    }


    const handleSubmit = async(e) => {
        e.preventDefault();
        if([desc, work, education, skills].includes('')){
            alert('error');
            return;
        }
    
        const data = new FormData();
        data.append('desc', desc);
        data.append('work', work);
        data.append('education', education);
        data.append('skills', skills);
        // data.append('image', file)

        if(newImage){ 
            // data.previousName=image //user chose a new image
            data.append('previousName', image.public_id)
        }else{
        // if(Object.keys(image) !== ''){
            data.append('profilePicture', JSON.stringify(image))  //user not chose a new image
        }
        // }
        if(file){
            // const dataFile = new FormData();
            // const filename = Date.now() + file.name;
            // dataFile.append("name",filename);
            data.append("image", file);
            // data.profilePicture = filename;
            //addNewFileRedux(dataFile);
          }
        try {
            const res = await axios.post(`${link}/users/new-info/${params.id}`, data);
            Swal.fire(
                res.data.msg,
                // 'You clicked the button!',
                'success'
            )
            //route('/');
        } catch (error) {
            console.log(error);
        }
        route(`/profile/${params.id}`);
    }  

    if(Object.keys(user) === '') return <Spinner />
  return (
    <div className=' '>
        <Sidebar />
        <div className="h-full my-20 mx-10">
            <div className="block md:flex ">
                <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} w-full md:w-2/5 p-4 sm:p-6 lg:p-8 shadow-md rounded`}>
                    <div className='p-5 bg-white rounded'>
                        <div className="flex justify-between">
                            <span className="text-xl font-semibold block">Admin Profile</span>
                        </div>
                        <p className="text-gray-600 font-bold">Name: <span className=' text-2xl'>{user.name}</span></p>
                        <p className="text-gray-600 font-bold">Email: <span className=' text-2xl'>{user.email}</span></p>
                        <div className="max-w-2xl mx-auto">
                            <label className="font-semibold text-gray-700 block pb-1">Upload file</label>
                            <input 
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                id="file_input" 
                                type="file" 
                                onChange={getFile}
                            />
                        </div>
                        <div className="w-full p-8 mx-2 flex justify-center">
                            {newImage ? (
                                    <img
                                    className="writeImg"
                                    src={URL.createObjectURL(file)}
                                    alt=""
                                />
                                ): (
                                    <>
                                        {image !== '' ? (
                                            <img
                                                className=""
                                                src={image.secure_url}
                                                alt=""
                                            />
                                        ): null}
                                    </>
                                )}
                        </div>
                    </div>
                   
                </div>
            
                <div className={`${theme ? 'bgt-light ' : 'bgt-dark'} w-full md:w-3/5 p-6 lg:ml-4 shadow-md rounded`}>
                    <form 
                        onSubmit={handleSubmit}
                    >
                        <div className="rounded bg-white  shadow p-6">
                            <div className="pb-6">
                                <label htmlFor="name" className="font-semibold text-gray-700 block pb-1">Description</label>
                                <div className="flex">
                                    <input 
                                        id="username" 
                                        className="border-1  rounded-r px-4 py-2 w-full" 
                                        placeholder='Description' 
                                        type="text" 
                                        onChange={(e) => setDesc(e.target.value)}
                                        value={desc}
                                    />
                                </div>
                            </div>
                            <div className="pb-4">
                                <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Work</label>
                                <input 
                                    id="email" 
                                    className="border-1  rounded-r px-4 py-2 w-full" 
                                    placeholder='Work' 
                                    type="text" 
                                    onChange={(e) => setWork(e.target.value)}
                                    value={work}
                                />
                            </div>
                            <div className="pb-4">
                                <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Education</label>
                                <input 
                                    id="email" 
                                    className="border-1  rounded-r px-4 py-2 w-full" 
                                    placeholder='Education' 
                                    type="text" 
                                    onChange={(e) => setEducation(e.target.value)}
                                    value={education}
                                />
                            </div>
                            <div className="pb-4">
                                <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Skills</label>
                                <input
                                    id="email" 
                                    className="border-1  rounded-r px-4 py-2 w-full" 
                                    placeholder='Skills'
                                    type="text" 
                                    onChange={(e) => setSkills(e.target.value)}
                                    value={skills}
                                />
                            </div>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditProfile