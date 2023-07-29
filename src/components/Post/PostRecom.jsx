import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PostRecom = ({title, id}) => {

    const link = useSelector(state => state.posts.linkBaseBackend);
    const theme = useSelector(state => state.posts.themeW);

    const [postsRecomend, setPostsRecomend] = useState([]);

    useEffect(() => {

    const getPostRecomend = async() => {
      try {
        const res = await axios.get(`${link}/posts/posts-recommend/${title}`);
        console.log(res.data);
        setPostsRecomend(res.data.recommendedPosts);
      } catch (error) {
          console.log(error);
      }      
    }
      getPostRecomend();
    }, [id, title])

    // if(Object.keys(post) == '' ) return <Spinner />

  return (
    <div className='mb-20 sm:mb-0'>
        <p className={`${theme ? '  text-black' : ' text-white'} text-lg my-5`}>Posts Recommended</p>
        {
            postsRecomend.map(post => (
                <Link to={`/view-post/${post._id}`} className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} my-2 block max-w-sm p-6  border border-gray-200 rounded-lg shadow `}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight">{post.title}</h5>
                    <p className="font-normal ">{post.desc}</p>
                    <div className="mb-3">
                    {post.categoriesPost.map(cat => (
                        <Link
                            key={cat}
                            to={`/category/${cat}`}
                            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-0">#{cat}</Link> 
                    ))}
                </div>
                </Link>
            ))
        }


    </div>
  )
}

export default PostRecom