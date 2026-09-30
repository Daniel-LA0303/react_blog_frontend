import React, { useEffect, useState } from 'react'
import useUserAuthContext from '../../../context/hooks/useUserAuthContext';
import { UserBadgeItem } from '../../../interfaces/badges.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { useParams } from 'react-router-dom';
import clientAuthAxios from '../../../services/clientAuthAxios';
import SmallSpinner from '../../../components/Spinner/SmallSpinner';
import BadgeCard from '../../../components/Badge/BadgeCard';
import Sidebar from '../../../components/Sidebar/Sidebar';
import AsideCollabDashboard from '../../../components/Aside/AsideCollabDashboard';

const BadgesDashborad = () => {

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
    const [badges, setBadges] = useState<UserBadgeItem[]>([]);
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
        setBadges([]); // clean post profile in case to change profile
        setPage(1);
        setHasMore(true);
        fetchBadges(1);
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
                fetchBadges();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, page]);


    /**
    * fetch posts with pagination (infinite scroll)
    */
    const fetchBadges = async (pageToFetch = page) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await clientAuthAxios.get(
                `/bagdes/badges-by-user/${params.id}?page=${pageToFetch}&limit=${limit}`
            );

            const { badges, meta } = response.data.data;

            if (badges && badges.length > 0) {
                setBadges((prev: any) => [...prev, ...badges])
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
                            My Badges
                        </h3>

                        <div className="mt-4 space-y-6 mb-10">
                            {badges.map((ba: UserBadgeItem, index) => (
                                <BadgeCard
                                    key={index}
                                    item={ba}
                                    dark={isDark}
                                />
                            ))}
                        </div>

                        {loading && <SmallSpinner />}
                        {!hasMore && (
                            <p className="text-center my-4 text-gray-500 text-sm">
                                No more badges
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BadgesDashborad