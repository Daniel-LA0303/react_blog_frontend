import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useUserAuthContext from '../../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { ProjectCollabItem } from '../../../interfaces/projects.interfaces';
import clientAuthAxios from '../../../services/clientAuthAxios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import ProjectCollabCard from '../../../components/Project/ProjectCollabCard';
import SmallSpinner from '../../../components/Spinner/SmallSpinner';
import AsideCollabDashboard from '../../../components/Aside/AsideCollabDashboard';

const ProjectColaboration = () => {

    /**
   * route
   */
    const params = useParams();

    /**
     * hooks
     */
    const { userAuth } = useUserAuthContext();
    const { globalData } = useGlobalDataContext();
    const isDark = !globalData.themeGlobal;

    /**
     * states
     */
    const [projects, setProjects] = useState<ProjectCollabItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // page 1
    const [hasMore, setHasMore] = useState(true); // check more blogs
    const limit = 10;

    /**
     * states Redux
     */

    // const link = useSelector(state => state.posts.linkBaseBackend);


    /**
     * useEffect
     */

    /**
    * init posts charge the first page
    */
    useEffect(() => {
        setProjects([]); // clean post profile in case to change profile
        setPage(1);
        setHasMore(true);
        fetchProjects(1);
    }, [params.id]);

    /**
     * infinite scroll
     */
    useEffect(() => {
        const handleScroll = () => {
            if (
                !loading &&
                hasMore &&
                window.innerHeight + document.documentElement.scrollTop + 50 >=
                document.documentElement.scrollHeight
            ) {
                fetchProjects();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, page]);


    /**
    * fetch posts with pagination (infinite scroll)
    */
    const fetchProjects = async (pageToFetch = page) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await clientAuthAxios.get(
                `/project/projects-as-collaborator/${params.id}?page=${pageToFetch}&limit=${limit}`
            );

            const { projects, meta } = response.data.data;

            if (projects && projects.length > 0) {
                setProjects((prev: any) => [...prev, ...projects])
                // setPosts((prev) => [...prev, ...data]);
                setPage(pageToFetch + 1);
                setHasMore(pageToFetch < meta.totalPages);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={`${globalData.themeGlobal ? 'text-black' : 'text-white'}`}>
            <Sidebar />

            <div className="flex flex-col lg:flex-row mx-auto max-w-7xl">
                {/* STATIC ASIDE */}
                <div className=''>
                    <AsideCollabDashboard />
                </div>

                {/* MAIN CONTENT */}
                <div className="flex flex-col items-center w-full lg:w-6/12 px-4 lg:mx-auto py-5">
                    <div className="w-full">
                        <h3
                            className={`text-left text-xl md:text-3xl font-semibold pb-0 ${globalData.themeGlobal ? '' : 'text-white'
                                }`}
                        >
                            My Projects
                        </h3>

                        <div className="mt-4 space-y-6 mb-10">
                            {projects.map((pr: ProjectCollabItem, index) => (
                                <ProjectCollabCard
                                    key={index}
                                    project={pr}
                                    dark={isDark}

                                />
                            ))}
                        </div>

                        {loading && <SmallSpinner />}
                        {!hasMore && (
                            <p className="text-center my-4 text-gray-500 text-sm">
                                No more projects
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectColaboration