import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Alert1 from '../../components/Alerts/Alert1';
import Spinner from '../../components/Spinner/Spinner';
import { alertOffAction, alertOnAction } from '../../StateRedux/actions/postAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useSwal } from '../../hooks/useSwal';

const UserConfirmed = () => {

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
     * states redux
     */
    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);
    const theme = useSelector(state => state.posts.themeW);
    const alert1 = useSelector(state => state.posts.alertMSG);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const dispatch = useDispatch();
    const alertMsg = (alert) => dispatch(alertOnAction(alert));
    const alertOff = () => dispatch(alertOffAction());

    /**
     * useEffect
     */
    useEffect(() => {
        if (user._id) {
            route('/');
        }
    }, [user]);

    useEffect(() => {
        const confirmUser = async () => {
            try {
                const { data } = await axios.get(`${link}/users/confirm/${params.id}`);

                console.log(data);
                showAutoSwal({
                    message: data.message,
                    status: "success",
                    timer: 2000
                });

            } catch (error) {
                showConfirmSwal({
                    message: error.response.data.message,
                    status: "error",
                    confirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        route('/');
                    } 
                });

            }
        }
        confirmUser();
    }, [])

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className={`relative ${theme
                    ? "bgt-white text-black"
                    : "bgt-black text-white"
                    } flex size-full min-h-screen flex-col items-center justify-center p-4`}>
                    <div className="w-full max-w-md space-y-8">

                        <div className={`${theme
                            ? " bgt-light text-black"
                            : "bgt-dark hover:bg-zinc-700 text-white"
                            } shadow-lg rounded-xl p-8 sm:p-10 text-center`}>

                            <FontAwesomeIcon
                                icon={faUserCheck}
                                className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400"
                            />

                            <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                                User confirmed!
                            </h1>

                            <div className="mt-8">
                                <Link
                                    to="/login"
                                    className="w-full inline-block text-center transform rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>


    )
}

export default UserConfirmed