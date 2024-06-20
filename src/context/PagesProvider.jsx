import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PagesContext = createContext();

const PagesProvider = ({children}) => {

    // pageHome: {},
    // pageCategoryByPost: {},
    // pageDashboard: {},
    // pageDashboardLikePostUser: {},
    // pagesDashboardFollowedFollowersUser: {},
    // pageSavedPostUser: {},
    // pageTagsUser: {},
    // pagePostUser: {},

    //states pages
    const [pageHome, setPageHome] = useState({});
    const [pageAllCategories, setPageAllCategories] = useState({});
    const [pageCategoryByPost, setPageCategoryByPost] = useState({});
    const [pageProfile, setPageProfle] = useState({});

    const [pageDashboard, setPageDashboard] = useState({});
    const [pageDashboardLikePostUser, setPageDashboardLikePostUser] = useState({});
    const [pagesDashboardFollowedFollowersUser, setPagesDashboardFollowedFollowersUser] = useState({});
    const [pageSavedPostUser, setPageSavedPostUser] = useState({});
    const [pageTagsUser, setPageTagsUser] = useState({});
    const [pagePostUser, setPagePostUser] = useState({});
    
    //General state
    const [categories, setCategories] = useState({});
    const [posts, setPosts] = useState({});
    const [user, setUser] = useState({});
    const [charge, setCharge] = useState(false);

    const [loadingPage, setLoading] = useState(false);

    useEffect(() => {
        
    
        const getUserAuth = async () => {
            console.log("getUserAuth");
            const token = localStorage.getItem('token');
            console.log(token);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            }

            try {

                const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/users/profile`, config);
                // const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-liked-post-user/63f02011ef0e20c6693b654d`);
                // console.log(response.data);
                setUser(response.data);
                // console.log(res.data);
            } catch (error) {
                console.log(error);
            }finally {

            }
        }

        getUserAuth();
      }, []);


    //functions

    //Get page Home
    const getPageHome = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-home`);
            setPageHome(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page all Categories
    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-categories`);
            console.log(response.data);
            setPageAllCategories(response.data.categories);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Category By Post
    const getPageCategoryByPost = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-category-post/${id}`);
            console.log(response.data);
            setPageCategoryByPost(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get profile page
    const getProfilePage = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-profile-user/${id}`);
            console.log(response.data);
            setPageProfle(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Dashboard
    const getPageDashboard = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard/${id}`);
            setPageDashboard(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Dashboard Like Post User
    const getPageDashboardLikePostUser = async (id) => {
        try {
            setLoading(true);
            console.log("id", id);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-liked-post-user/${id}`);
            setPageDashboardLikePostUser(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Dashboard Followed Followers User
    const getPagesDashboardFollowedFollowersUser = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-follow-user/${id}`);
            console.log(response.data);
            setPagesDashboardFollowedFollowersUser(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Saved Post User
    const getPageSavedPostUser = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-saved-post-user/${id}`);
            setPageSavedPostUser(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Tags User
    const getPageTagsUser = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-tag-use/${id}`);
            setPageTagsUser(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    //Get page Post User
    const getPagePostUser = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-post-user/${id}`);
            console.log(response.data);
            setPagePostUser(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }




    return (
        <PagesContext.Provider
            value={{

                user,
                //state
                pageHome,
                pageAllCategories,
                pageCategoryByPost,
                pageProfile,

                pageDashboard,
                pageDashboardLikePostUser,
                pagesDashboardFollowedFollowersUser,
                pageSavedPostUser,
                pageTagsUser,
                pagePostUser,

                loadingPage,
                //functions
                getPageHome,
                getAllCategories,
                getPageCategoryByPost,
                getProfilePage,

                getPageDashboard,
                getPageDashboardLikePostUser,
                getPagesDashboardFollowedFollowersUser,
                getPageSavedPostUser,
                getPageTagsUser,
                getPagePostUser

            }}
        >
            {children}
        </PagesContext.Provider>
    )
}

export {PagesProvider}

export default PagesContext;



