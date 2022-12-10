import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar'

import { useParams, useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const dispatch = useDispatch();

    const params = useParams();
    const route = useNavigate();
    // const [user, setUser] = useState({});
    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);

    const PF = useSelector(state => state.posts.PFLink);



    const[desc, setDesc] = useState('');
    const[work, setWork] = useState('');
    const[education, setEducation] = useState('');
    const[skills, setSkills] = useState('');
    
    const[image, setImage]= useState(''); //image
    const[file, setFile] = useState(null); //get new image
    const[newImage, setNewImage] = useState(false); //new image validation

    console.log(params.id);

    useEffect(() => {
        const getOneUser = async() => {
            try {
                const res = await axios.get(`http://localhost:4000/api/users/get-profile/${params.id}`);
                console.log(res.data);
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

    useEffect(() => {
        if(!user._id){
            route('/');
            
        }
        // if(!loading){

        // }
    }, [user]);
    
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
        const data={
            info: {
                desc: desc,
                work: work,
                education: education,
                skills: skills
            }
        }
        console.log(data);
        if(newImage){ 
            data.previousName=image //user chose a new image
        }else{
            data.profilePicture=image //user not chose a new image
        }
        if(file){
            const dataFile = new FormData();
            const filename = Date.now() + file.name;
            dataFile.append("name",filename);
            dataFile.append("image", file);
            data.profilePicture = filename;
            try {
              await axios.post('http://localhost:4000/api/users/uploads-profile', dataFile)
            } catch (error) {
              console.log(error);
            }
          }
        try {
            const res = await axios.post(`http://localhost:4000/api/users/new-info/${params.id}`, data);
            console.log(res.data);

            route('/');
        } catch (error) {
            console.log(error);
        }
        route(`/profile/${params.id}`);
    }  

    if(desc === '') return <p>loading</p>
  return (
    <div className=' '>
      
                    <Sidebar />
        <div className="h-full my-20 mx-10">
            {/* <p>{user.name}</p> */}
            <div className="border-b-2 block md:flex">
                <div className="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
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
                                        src={PF+image}
                                        alt=""
                                    />
                                ): null}
                            </>
                        )}
                </div>
                </div>
            
                <div className="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
                    <form 
                        onSubmit={handleSubmit}
                    >
                        <div className="rounded  shadow p-6">
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
                            <button type="submit" className="w-full text-white bg-sky-600 py-2 rounded">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default EditProfile