import axios from 'axios';
import React, { useEffect, useState } from 'react'

import Sidebar from '../../components/Sidebar/Sidebar'

import { useParams, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { addNewFileUserAction } from '../../StateRedux/actions/postAction';

import Spinner from '../../components/Spinner/Spinner';
import Swal from 'sweetalert2';

const EditProfile = () => {

    /**
     * route
     */
    const params = useParams();
    const route = useNavigate();

    /**
     * states
     */
    const[desc, setDesc] = useState('');
    const[work, setWork] = useState('');
    const[education, setEducation] = useState('');
    const[skills, setSkills] = useState('');
    const[image, setImage]= useState({}); //image
    const[file, setFile] = useState(null); //get new image
    const[newImage, setNewImage] = useState(false); //new image validation
    const[loading, setLoading] = useState(false);

    /**
     * states Redux
     */
    const dispatch = useDispatch();
    const user = useSelector(state => state.posts.user);
    const addNewFileRedux = (dataFile) => dispatch(addNewFileUserAction(dataFile));
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    /**
     * useEffect
     */
    useEffect(() => {
        setLoading(true);
        axios.get(`${link}/pages/page-edit-profile/${params.id}?user=${user._id}`)
        .then((response) => {
            setDesc(response.data.user.info?.desc);
            setWork(response.data.user.info?.work);
            setEducation(response.data.user.info?.education);
            setSkills(response.data.user.info?.skills);
            setImage(response.data.user?.profilePicture);
            console.log(response.data);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        })
        .catch((error) => {
            console.log(error);
            if(error.code === 'ERR_NETWORK'){
            const data ={
                error: true,
                message: {
                    status: null,
                    message: 'Network Error',
                    desc: null
                }
            }
            setLoading(false);
            route('/error', {state: data});
            }else{
            const data = {
                error: true,
                message: {
                    status: error.response.status,
                    message: error.message,
                    desc: error.response.data.msg
                }
            }
            setLoading(false);
            route('/error', {state: data});
            }
        })
      }, [params.id]);
    

    /**
     * Functions
     */
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

        if(newImage){ 
            data.append('previousName', image.public_id)
        }else{
            data.append('profilePicture', JSON.stringify(image))  //user not chose a new image
        }

        if(file){
            data.append("image", file);
        }

        try {
            const res = await axios.post(`${link}/users/new-info/${params.id}?user=${user._id}`, data);
            Swal.fire(
                res.data.msg,
                'success'
            )
            route(`/profile/${params.id}`);
        } catch (error) {
            Swal.fire({
                title: error.response.data.msg,
                text: "Status " + error.response.status,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        
    }  

    if(Object.keys(user) === '') return <Spinner />
return (
  <div>
    {loading ? <Spinner /> : (
      <>
        <Sidebar />
        <main className="flex flex-1 justify-center py-10">
          <div 
            className={`${theme ? 'text-black' : 'text-white'} w-full max-w-3xl`}
          >
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tighter ">Edit Profile</h1>
              <p className="mt-2 ">Update your profile information and preferences.</p>
            </div>

            <div 
                className={`${theme ? 'bgt-light' : 'bgt-dark'} rounded-lg  shadow-sm`}
            >
              <div className="p-8">

                {/* Profile Picture */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <p className="text-lg font-semibold ">Profile Picture</p>
                    <p className="mt-1 text-sm ">Update your avatar. We recommend a picture of at least 300x300px.</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-6">
                      <div
                        className="h-24 w-24 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${newImage ? URL.createObjectURL(file) : image?.secure_url})` }}
                      ></div>
                      <div className="flex flex-col gap-2">
                        <label className="flex h-10 cursor-pointer items-center justify-center rounded-md  px-4 text-sm font-semibold  ring-1 ring-inset ring-gray-300 ">
                          <span>Change</span>
                          <input type="file" className="hidden" onChange={getFile} />
                        </label>
                        {image && !newImage && (
                          <button
                            type="button"
                            className="text-sm font-medium  hover:"
                            onClick={() => { setImage(null); setFile(null); setNewImage(true); }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Personal Information */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <p className="text-lg font-semibold ">Personal Information</p>
                    <p className="mt-1 text-sm ">This information will be displayed publicly.</p>
                  </div>
                  <div className="space-y-6 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium " htmlFor="description">Description</label>
                      <textarea
                        className="text-black p-2 form-textarea mt-1 block w-full resize-y rounded-md border-gray-300  shadow-sm  sm:text-sm"
                        id="description"
                        placeholder="Tell us a little bit about yourself."
                        rows="4"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium " htmlFor="work">Work</label>
                      <input
                        className="text-black p-2 form-input mt-1 block w-full rounded-md border-gray-300  shadow-sm  sm:text-sm"
                        id="work"
                        type="text"
                        placeholder="Frontend Developer at Stitch"
                        value={work}
                        onChange={(e) => setWork(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium " htmlFor="education">Education</label>
                      <input
                        className="text-black p-2 form-input mt-1 block w-full rounded-md border-gray-300  shadow-sm  sm:text-sm"
                        id="education"
                        type="text"
                        placeholder="Bachelor's in Computer Science"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium " htmlFor="skills">Skills</label>
                      <input
                        className="text-black p-2 form-input mt-1 block w-full rounded-md border-gray-300  shadow-sm  sm:text-sm"
                        id="skills"
                        type="text"
                        placeholder="HTML, CSS, JavaScript, React, Tailwind CSS"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 rounded-b-lg border-t px-8 py-4">
                <button
                  type="button"
                  className="text-black flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-md bg-white px-4 text-sm font-semibold   hover:bg-gray-400"
                  onClick={() => route(-1)}
                >
                  <span className="truncate">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold text-white shadow-sm"
                  onClick={handleSubmit}
                >
                  <span className="truncate">Save</span>
                </button>
              </div>

            </div>
          </div>
        </main>
      </>
    )}
  </div>
);

}

export default EditProfile