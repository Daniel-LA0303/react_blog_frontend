import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

import Sidebar from '../../components/Sidebar/Sidebar'

import { useParams, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../components/Spinner/Spinner';
import { editUserAction } from '../../StateRedux/actions/usersActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import clientAuthAxios from '../../services/clientAuthAxios';
import { useSwal } from '../../hooks/useSwal';

const EditProfile = () => {

  /**
   * route
   */
  const params = useParams();
  const route = useNavigate();

  /**
  * hooks
  */
  const { showAutoSwal, showConfirmSwal } = useSwal();

  /**
   * states
   */
  const [desc, setDesc] = useState('');
  const [work, setWork] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [image, setImage] = useState({}); //image
  const [imageRes, setImageRes] = useState({});
  const [file, setFile] = useState(null); //get new image
  const [newImage, setNewImage] = useState(false); //new image validation
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  /**
   * states Redux
   */
  const dispatch = useDispatch();
  const user = useSelector(state => state.posts.user);
  const updateUserRedux = (userId, editUserData, route) => dispatch(editUserAction(userId, editUserData, route));
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true);
    clientAuthAxios.get(`${link}/pages/page-edit-profile/${params.id}?user=${user._id}`)
      .then((response) => {


        setDesc(response.data.data.info?.desc);
        setWork(response.data.data.info?.work);
        setEducation(response.data.data.info?.education);
        setSkills(response.data.data.info?.skills);
        setImage(response.data.data?.profilePicture);
        setImage(response.data.data?.profilePicture);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
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
          const data = {
            error: true,
            message: {
              // status: error.response.status,
              // message: error.message,
              // desc: error.response.data.msg
            }
          }
          setLoading(false);
          route('/error', { state: data });
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

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && inputSkill.trim() !== "") {
      e.preventDefault();
      // evitar duplicados
      if (!skills.includes(inputSkill.trim())) {
        setSkills([...skills, inputSkill.trim()]);
      }
      setInputSkill(""); // limpiar input
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. validate info
    if ([desc, work, education, skills].includes('')) {
      showConfirmSwal({
        message: "All fields are required",
        status: "warning",
        confirmButton: true
      })
      return;
    }

    if (skills.length > 10) {
      showConfirmSwal({
        message: "Please insert between 1 - 10 skills",
        status: "warning",
        confirmButton: true
      })

      return;
    }

    // 2. assemble data
    const data = new FormData();
    data.append('desc', desc);
    data.append('work', work);
    data.append('education', education);
    const skillsArray = skills.map(s => s.trim()); 
    data.append('skills', JSON.stringify(skillsArray));
    // data.append('skills', skills);

    // 3. check if there is a new image
    if (newImage) {
      data.append('previousName', imageRes.public_id)
    } else {
      data.append('profilePicture', JSON.stringify(image))  //user not chose a new image
    }

    // 4. check if there is a new file
    if (file) {
      data.append("image", file);
    }

    // 5. send data
    dispatch(updateUserRedux(params.id, data, route));

  }

  const quitImage = () => {
    console.log("quit image");

    if (file || image) {
      setFile(null);
      setImage(null);
    }


  }

  if (Object.keys(user) === '') return <Spinner />
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
                        {
                          file || (image?.secure_url !== "") ?
                            <div
                              className="relative z-0 h-24 w-24 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
                              style={{ backgroundImage: `url(${newImage ? URL.createObjectURL(file) : image?.secure_url})` }}
                            >

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
                              className="flex h-24 w-24 flex-col rounded-full items-center justify-center border-2 border-dashed border-gray-300  cursor-pointer p-6 hover:border-gray-500 transition-colors bg-gray-50"
                            >
                              {/* <Image className="text-gray-400 mb-2" style={{ fontSize: 48 }} />here */}
                              <FontAwesomeIcon icon={faImage} size='2x' className=' text-gray-700' />
                              <span className="text-gray-500 text-xs text-center">
                                Image here
                              </span>
                              <input
                                type="file"
                                ref={inputRef}
                                className="hidden"
                                onChange={getFile}
                              />
                            </div>
                        }

                        <div className="flex flex-col gap-2">
                          <label className="flex h-10 cursor-pointer items-center justify-center rounded-md  px-4 text-sm font-semibold  ring-1 ring-inset ring-gray-300 ">
                            <span>Change</span>
                            <input type="file" className="hidden" onChange={getFile} />
                          </label>
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
                        <label className="block text-sm font-medium mb-1" htmlFor="skills">Skills Press Enter to Add (max 0 - 10)</label>

                        <div className="flex flex-wrap gap-2 rounded">
                          {skills.map((skill, idx) => (
                            <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                              {skill}
                              <button type="button" onClick={() => handleRemoveSkill(skill)} className="font-bold">×</button>
                            </span>
                          ))}

                          <input
                            id="skills"
                            type="text"
                            placeholder="Type and press Enter"
                            className="flex-1 border-none outline-none p-2 rounded-md text-black"
                            value={inputSkill}
                            onChange={(e) => setInputSkill(e.target.value)}
                            onKeyDown={handleAddSkill}
                          />
                        </div>
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