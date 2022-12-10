import React, { useEffect } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'

import { Link, useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

import { useDispatch, useSelector } from 'react-redux';
import { deletePostAction, getOnePostAction } from '../StateRedux/actions/postAction';

import Spinner from '../components/Spinner/Spinner';

const ViewPost = () => {

  const dispatch = useDispatch();

  const params = useParams();
  const route = useNavigate();

  //get post with id
  useEffect(() => {
      const getOnePostState = () => dispatch(getOnePostAction(params.id));
      getOnePostState();
  }, []);


  //redux
  const post = useSelector(state => state.posts.post);
  const user = useSelector(state => state.posts.user);
  const PF = useSelector(state => state.posts.PFPost);
  const deletePostRedux = (id) => dispatch(deletePostAction(id));

  const deletePostComponent = async (id) => {
      deletePostRedux(id);
      route('/');
  }

  if(Object.keys(post) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      <div className='w-full sm:w-4/6 lg:w-3/6 mx-auto rounded-lg bg-gray-100'>
        <div className=''>
            <div className="overflow-hidden h-96">
                {post.linkImage && (
                    <img 
                        className="img-cover" 
                        src={PF+post.linkImage}
                        alt="Sunset in the mountains" 
                    />
                )}
            </div>
        </div>
        {user._id === post.user._id ? (
          <div className=' flex justify-end'>
            <FontAwesomeIcon 
              onClick={() => deletePostComponent(params.id)}
              className=' text-2xl text-red-500 p-2 cursor-pointer'
              icon={faTrash} 
            />
            <Link
              to={`/edit-post/${params.id}`}
            >
              <FontAwesomeIcon 
                icon={faPen} 
                className=' text-2xl text-sky-500 p-2 cursor-pointer'
              />
            </Link>
          </div>
         ): null} 
        <div className=" mt-5 p-4">
            <h2 className=' font-bold text-5xl mb-3'>{post.title}</h2>
            <p className="mb-3 font-normal ">Posted on {new Date(post.createdAt).toDateString()}</p>
            {post.categoriesPost.map(cat => (
                <Link
                    key={cat}
                    to={`/category/${cat}`}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat}</Link> 
                ))}
            <div 
                className="ql-editor post bg-content" 
                dangerouslySetInnerHTML={{ __html: post.content}}  
            />
        </div>
    </div>
  </div>
  )
}

export default ViewPost