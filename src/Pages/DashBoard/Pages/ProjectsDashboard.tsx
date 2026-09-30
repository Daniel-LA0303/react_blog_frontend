import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import useUserAuthContext from '../../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { ProjectCollabItem } from '../../../interfaces/projects.interfaces';
import clientAuthAxios from '../../../services/clientAuthAxios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import ProjectCollabCard from '../../../components/Project/ProjectCollabCard';
import SmallSpinner from '../../../components/Spinner/SmallSpinner';
import AsideCollabDashboard from '../../../components/Aside/AsideCollabDashboard';
import CreateProjectModal from '../../../components/Project/CreateProjectModal';

const ProjectsDashboard = () => {

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
    const [createOpen, setCreateOpen] = useState(false)

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
                `/project/get-projects-by-owner/${params.id}?page=${pageToFetch}&limit=${limit}`
            );

            console.log(response);


            const { projects, meta } = response.data.data;
            console.log(response.data.data.projects);

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
                        {(!hasMore && projects.length === 0) && (
                            <div
                                className={`my-6 rounded-2xl border border-dashed px-6 py-10 flex flex-col items-center text-center gap-4 ${isDark ? 'border-gray-700 bg-[#27272A]/40' : 'border-gray-200 bg-white/60'
                                    }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ring-1 ring-offset-2 ${isDark ? 'bg-gray-800 text-gray-300 ring-gray-700 ring-offset-[#18181B]' : 'bg-gray-50 text-gray-600 ring-gray-200 ring-offset-gray-50'
                                        }`}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M12 5v14" /><path d="M5 12h14" />
                                    </svg>
                                </div>

                                <div>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        You've reached the end
                                    </p>
                                    <p className={`text-xs mt-1 max-w-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Can't find what you're looking for? Create your own project and share it with others.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setCreateOpen(true)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
                                >
                                    New project
                                </button>
                            </div>
                        )}
                        {!hasMore && (
                            <p className="text-center my-4 text-gray-500 text-sm">
                                No more projects
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} dark={isDark} />
        </div>
    )
}

export default ProjectsDashboard