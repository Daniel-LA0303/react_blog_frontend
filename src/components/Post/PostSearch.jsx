import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Spinner from '../Spinner/Spinner';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const notify = () => toast(
    'Post saved.',
    {
        duration: 1500,
        icon: '💼'
    }
  );
  
  const notify2 = () => toast(
    'Quit post.',
    {
        duration: 1500,
        icon: '👋'
    }
  );

const PostSearch = ({post}) => {
    const {title, linkImage, categoriesPost, _id, desc, createdAt, user, likePost, date} = post;

    const[like, setLike] = useState(false);
    const[numberLike, setNumberLike] =  useState(0);
    const[save, setSave] = useState(false);
    const[imageProfile, setImageProfile] = useState('');

    const PF = useSelector(state => state.posts.PFPost);
    const PP = useSelector(state => state.posts.PFLink);
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);
    
    useEffect(() => {
        const getOnePost = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/posts/${post._id}`);
                setImageProfile(res.data.user.profilePicture)
            } catch (error) {
                console.log(error);
            }
        }
        getOnePost();

    }, []);
    
    useEffect(() => {
        const userLike = likePost.users.includes(userP._id);
        if(userLike){
            setLike(true);
        }
        setNumberLike(likePost.users.length);
        console.log();

    }, []);

    useEffect(() => {
        if(Object.keys(userP) != ''){
            const userPost = userP.postsSaved.posts.includes(_id);
            if(userPost){
                setSave(true);
            }
        }
    }, []);
    
    const handleLike = async (id) => {
        
        setLike(!like);
        if(like){
            setNumberLike(numberLike-1);
        }else{
            setNumberLike(numberLike+1)
        }
        try {
            const res =await axios.post(`http://localhost:4000/api/posts/like-post/${id}`, userP);
            console.log(res);
        } catch (error) {
            console.log(error);

        }
    }

    const handleSave = async (id) => {
        setSave(!save);
        if(save){
            notify2()
        }else{
            notify()
        }
        try {
            await axios.post(`http://localhost:4000/api/posts/save-post/${id}`, userP);
        } catch (error) {
            console.log(error);

        }
    }

    if(Object.keys(post) == '' ) return <Spinner />

  return (
    <>
    <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} flex mx-auto items-center flex-col sm:flex-row w-full sm:w-5/6 lg:w-5/6 xl:w-5/6 my-5 rounded-2xl`}>
        <div className=' w-full md:w-4/12'>
            <img className="object-cover w-full h-20   md:h-60 md:rounded-none md:rounded-l-lg block" src={linkImage.secure_url} alt="" />   
        </div>
        
        <div className="flex flex-col  w-full  justify-between p-4 leading-normal">
            {/* <div className='flex justify-between'> */}
                <h5 className="mb-2 text-2xl w-4/6  font-bold tracking-tight ">{title}</h5>
                {/* <span className="mb-3 font-normal w-auto text-gray-700 dark:text-gray-400">Posted on {new Date(date).toDateString()}</span> */}
            {/* </div> */}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{desc}</p>
            <div className="mb-3">
                {categoriesPost.map(cat => (
                    <Link
                        key={cat}
                        to={`/category/${cat}`}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat}</Link> 
                ))}
            </div>
            <div className='flex justify-end items-center'>

                <Link to={`/view-post/${_id}`} className=" w-32 h-auto inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" ></path></svg>
                </Link>
            </div>
            {userP._id ? (
                <div class="  flex items-center justify-between mt-5">
                    <div className='flex'>
                        <p className='mx-3'>{numberLike}</p>
                        <button onClick={() => handleLike(_id)}>
                            <FontAwesomeIcon 
                                icon={faHeart} 
                                className={`${like ? ' text-red-400' :  ' text-white'}   mx-auto  rounded`}
                                
                            />
                        </button>
                    </div>
                    <button onClick={() => handleSave(_id)}>
                        <FontAwesomeIcon 
                            icon={faBookmark} 
                            className={`${save ? 'text-blue-500': 'text-white '}    mx-auto  rounded`}
                        />
                    </button>
                </div>
            ): (
                null
            )}
           
        </div>
    </div>
</>
  )
}

export default PostSearch