import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import useUserAuthContext from '../../../context/hooks/useUserAuthContext';
import clientAuthAxios from '../../../services/clientAuthAxios';
import SmallSpinner from '../../../components/Spinner/SmallSpinner';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { StudyListItemPaginated } from '../../../interfaces/lists.interfaces';
import ListCard from '../../../components/Lists/ListCard';
import AsideCollabDashboard from '../../../components/Aside/AsideCollabDashboard';

const StudyListDashboard = () => {


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
    const [lists, setLists] = useState<StudyListItemPaginated[]>([]);
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
        setLists([]); // clean post profile in case to change profile
        setPage(1);
        setHasMore(true);
        fetchLists(1);
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
                fetchLists();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, page]);


    /**
    * fetch posts with pagination (infinite scroll)
    */
    const fetchLists = async (pageToFetch = page) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await clientAuthAxios.get(
                `/lists/study-lists-by-owner?page=${pageToFetch}&limit=${limit}`
            );

            const { data, meta } = response.data.data;
            if (data && data.length > 0) {
                setLists((prev: any) => [...prev, ...data])
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
                            My Lists
                        </h3>

                        <div className="mt-4 space-y-6 mb-10">
                            {lists.map((li: StudyListItemPaginated) => (
                                <ListCard
                                    list={li}
                                    dark={isDark}
                                />
                            ))}
                        </div>

                        {loading && <SmallSpinner />}
                        {(!hasMore && lists.length === 0) && (
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
                                </div>

                                <Link
                                    to="/lists"
                                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
                                >
                                    Explore Lists
                                </Link>
                            </div>
                        )}
                        {!hasMore && (
                            <p className="text-center my-4 text-gray-500 text-sm">
                                No more lists
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudyListDashboard