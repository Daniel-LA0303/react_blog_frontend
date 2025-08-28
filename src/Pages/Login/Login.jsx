import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import Alert1 from '../../components/Alerts/Alert1';
import { alertOffAction, alertOnAction } from '../../StateRedux/actions/postAction';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';

const Login = () => {

  const theme = useSelector(state => state.posts.themeW);

  /**
   * route 
   */
  const route = useNavigate();

  /**
   * hooks
   */
  const { setUserAuth } = userUserAuthContext();
  const { showAutoSwal, showConfirmSwal } = useSwal();

  /**
   * states
   */
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = data;

  /**
   * states redux
   */
  const loading = useSelector(state => state.posts.loading);
  const alert1 = useSelector(state => state.posts.alertMSG);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const dispatch = useDispatch();
  const alertMsg = (alert) => dispatch(alertOnAction(alert));
  const alertOff = () => dispatch(alertOffAction());

  /**
   * useEffect
   */
  useEffect(() => {
    alertOff();
  }, [])

  /**
   * functions
   */
  const getData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([email, password].includes('')) {
      showConfirmSwal({
        message: "All fields are required",
        status: "warning",
        confirmButton: true
      })
      return;
    }
    try {
      const res = await axios.post(`${link}/users/login`, data);

      localStorage.setItem("token", JSON.stringify(res.data.data.token));
      localStorage.setItem("tokenAuthUser", res.data.data.token);
      localStorage.setItem("email", res.data.data.email);
      localStorage.setItem("username", res.data.data.name);
      localStorage.setItem("userId", res.data.data._id);
      localStorage.setItem("profileImage", res.data.data.profileImage);

      localStorage.setItem("likePost", JSON.stringify(res.data.data.likePost));
      localStorage.setItem("postsSaved", JSON.stringify(res.data.data.postsSaved));
      localStorage.setItem("followsTags", JSON.stringify(res.data.data.followsTags));
      localStorage.setItem("followersUsers", JSON.stringify(res.data.data.followersUsers));
      localStorage.setItem("followedUsers", JSON.stringify(res.data.data.followedUsers));

      setUserAuth({
        userAuthToken: res.data.data.token,
        username: res.data.data.name,
        profileImage: res.data.data.profileImage,
        email: res.data.data.email,
        userId: res.data.data._id,
        likePost: res.data.data.likePost || { reactions: 0, posts: [] },
        postsSaved: res.data.data.postsSaved || { saved: 0, posts: [] },
        followsTags: res.data.data.followsTags || { countTags: 0, tags: [] },
        followersUsers: res.data.data.followersUsers || { countFollowers: 0, followers: [] },
        followedUsers: res.data.data.followedUsers || { countFollowed: 0, followed: [] },
        themeGlobal: null
      });

      showAutoSwal({
        message: 'Login successfully',
        status: "success",
        timer: 2000
      });

      setTimeout(() => {
        route('/');
      }, 1000)

    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  return (
    <>
      {loading ? null : (
        <section className='min-h-screen flex items-center justify-center'>
          <div
            className={`${theme
              ? " bgt-light text-black"
              : "bgt-dark hover:bg-zinc-700 text-white"
              }  w-full max-w-screen-md flex flex-col items-center justify-center rounded-lg shadow p-6`}
          >
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
                  Welcome back
                </h2>
                <p className="mt-2 text-center text-sm ">
                  Sign in to continue to{" "}
                  <span className="font-semibold">DLTechBlog</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4 rounded-md shadow-sm">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      placeholder="Email address"
                      onChange={getData}
                      value={email}
                      className="form-input relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      onChange={getData}
                      value={password}
                      className="form-input relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    to={"/forget-password"}
                    className="font-medium hover:text-blue-600 text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    Log in
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm ">
                Don’t have an account?{" "}
                <Link
                  to={"/register"}
                  className="font-medium text-sky-500 hover:text-blue-600"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Login