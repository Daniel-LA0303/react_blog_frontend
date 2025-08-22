import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import Alert1 from '../../components/Alerts/Alert1';
import { alertOffAction, alertOnAction } from '../../StateRedux/actions/postAction';

const Register = () => {

    const theme = useSelector(state => state.posts.themeW);

    /**
     * route
     */
    const route = useNavigate();

    /**
     * states
     */
    const[password2, setPassword2] = useState('');
    const[data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const {name, email, password} = data;

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
            [e.target.name] : e.target.value
        })
    }

    const sendData = async (e) => {
        e.preventDefault();
        if([name, email, password, password2].includes('')){
            alertMsg({
                msg: "All fields are required",
                error: true
            })
            return;
        }
        if(password !== password2){
            alertMsg({
                msg: "The passwords must be the same",
                error: true
            })
            return;
        }

        try {
            const res = await axios.post(`${link}/users`, data);
            alertMsg({
                msg: res.data.msg,
                error: false
            })
            setTimeout(() => {
                route('/');
            }, 3000);
        } catch (error) {
            alertMsg({
                msg: error.response.data.msg,
                error: true
            })

        }
        setTimeout(() => {
            alertOff();
        }, 3000);
        
        
    }

    const {msg} = alert1;

  return (
<>
  {loading ? (
    <Spinner />
  ) : (
    <section className="min-h-screen flex items-center justify-center">
      <div
        className={`${
          theme
            ? "bgt-light text-black"
            : "bgt-dark hover:bg-zinc-700 text-white"
        } w-full max-w-screen-md flex flex-col items-center justify-center rounded-lg shadow p-6`}
      >
        <div className="w-full max-w-md space-y-8">
          {msg && <Alert1 alertMsg={alertMsg} />}

            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
                Welcome
              </h2>
              <p className="mt-2 text-center text-sm ">
                Sign up to continue to{" "}
                <span className="font-semibold">DLTechBlog</span>
              </p>
            </div>

          <form onSubmit={sendData} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="name" className="sr-only">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Name"
                  onChange={getData}
                  value={name}
                  className="form-input relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
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
                  required
                  placeholder="Password"
                  onChange={getData}
                  value={password}
                  className="form-input relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password2" className="sr-only">
                  Repeat Password
                </label>
                <input
                  type="password"
                  name="password2"
                  id="password2"
                  required
                  placeholder="Repeat Password"
                  onChange={(e) => setPassword2(e.target.value)}
                  className="form-input relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm">
            I have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-sky-500 hover:text-blue-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )}
</>


  )
}

export default Register