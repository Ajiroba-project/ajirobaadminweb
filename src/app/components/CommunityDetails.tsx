import React, { useState } from "react";
import Image from "next/image";
import { FaThumbsUp, FaRegCommentDots, FaShareAlt } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import clock from "../../asset/image/clock.svg";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useAuthStore } from "@/store/store";
import { useMutateData } from "@/hooks/useMutateData";
import { useGetOrderData } from "@/hooks/useGetData";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlinePicture } from "react-icons/ai";
import Loading from "@/app/components/Loading";
import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";
import PostCreationForm from "./PostCreationForm";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";

type CommentFormValues = {
    comment: string;
    commentImage?: string;
    post_id?: string;
};

const TabComponent = ({
    activeTab,
    setActiveTab,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) => {
    const tabs = ["Trending", "Liked", "Bookmarked"];

    return (
        <div className="flex justify-center mb-6 w-full">
            <div className="flex w-full rounded-lg border border-gray-300 overflow-hidden">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(tab)}
                        className={`w-1/3 py-3 text-center font-medium text-sm transition-colors ${
                            activeTab === tab
                                ? "bg-[#f25e26] text-white" // Active tab
                                : "bg-white text-gray-600 hover:bg-gray-50" // Inactive tabs
                        } ${index === 0 ? "rounded-l-lg" : ""} ${
                            index === tabs.length - 1 ? "rounded-r-lg" : ""
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};



const ITEMS_PER_PAGE = 5; // Adjust based on your needs



const ContentPost = ({ activeTab }: { activeTab: string }) => {
    const router = useRouter();

    const commentSchema = yup.object().shape({
        comment: yup.string().required('Comment is required'),
    });

    // State to manage comment input per post
    const [commentState, setCommentState] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<CommentFormValues>({
        resolver: yupResolver(commentSchema),
    });

    const handleSuccess = (data?: any) => {
        setComment('');
        setCommentImage('');
        setSelectedImage(null);
        if (data.status === 200 || data.status === 201) {
            toast.success(`${data?.data?.message || data?.data?.detail}`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                onClose: () => router.push('/profile'),
            });
            refetch();
        } else if (
            data.status === 403 ||
            data.status === 404 ||
            data.status === 401 ||
            data.status === 409 ||
            data.status === 500
        ) {
            setComment('');
            setCommentImage('');
            setSelectedImage(null);
            toast.error(`${data?.data?.message || data?.data?.detail}`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            refetch();
        } else {
            setComment('');
            setCommentImage('');
            toast.error(`${data?.data?.detail}`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            refetch();
        }
    };

    const handleError = (error?: any) => {
        console.log(error, 'errr', data, 'daaaattt');
        setComment('');
        setCommentImage('');
        setSelectedImage(null);
        toast.error(`${data?.data?.detail || error || 'An Error Occured'}`, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
        refetch();
    };

    const { isLoggedIn, user, token } = useAuthStore((state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
    }));

    // const userToken = token;
    const userToken = Cookies.get('token') as string;

    const { data, error, isError, isSuccess, mutate, status } = useMutateData(
        'comment_on_post',
        handleSuccess,
        handleError,
    );

    const [comment, setComment] = useState<string>('');
    const [commentImage, setCommentImage] = useState<string>('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedImage(base64String);
                setValue('commentImage', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const {
        data: trendingrinfo,
        isLoading: trendingLoading,
        error: trendingerror,
        refetch,
    } = useGetOrderData('/api/trendingposts', 'get_trending_posts', userToken);

    const {
        data: notinfo,
        isLoading: notLoading,
        error: noterror,
        refetch: notrefetch,
    } = useGetOrderData(
        '/api/communitynotifications',
        'get_trending_posts',
        userToken,
    );

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const onSubmit = (data: CommentFormValues) => {
        const payload = {
            post_id: data.post_id,
            comment: data.comment,
            comment_images: [data.commentImage],
        };

        mutate({
            url: '/api/commentonpost/',
            payload: { payload, tkn: userToken },
            token: userToken,
        });

        setComment('');
        setCommentImage('');
        reset();
    };

    const { mutate: likedmutate, status: likedstatus } = useMutateData(
        'like_or_unlike_post',
        handleSuccess,
        handleError,
    );

    const { mutate: dislikedmutate, status: dislikedstatus } = useMutateData(
        'dislike_post',
        handleSuccess,
        handleError,
    );

    const { mutate: bookmarkmutate, status: bookmarkedstatus } = useMutateData(
        'bookmark_post',
        handleSuccess,
        handleError,
    );

    const { mutate: unbookmarkmutate, status: unbookmarkedstatus } =
        useMutateData('unbookmark_post', handleSuccess, handleError);

    const [postLikes, setPostLikes] = useState<{
        [key: string]: { count: number; liked: boolean };
    }>({});

    const handleLike = (postId: string, liked: boolean) => {
        likedmutate({
            url: `/api/likepost/`,
            payload: { post_id: postId, tkn: userToken },
            token: userToken,
        });
    };

    const handledisLike = (postId: string, liked: boolean) => {
        dislikedmutate({
            url: `/api/dislikepost/`,
            payload: { post_id: postId, tkn: userToken },
            token: userToken,
        });
    };

    const handleBookMark = (postId: string, liked: boolean) => {
        bookmarkmutate({
            url: `/api/bookmark/`,
            payload: { post_id: postId, tkn: userToken },
            token: userToken,
        });
    };

    const handleUnBookMark = (postId: string, liked: boolean) => {
        unbookmarkmutate({
            url: `/api/unbookmark/`,
            payload: { post_id: postId, tkn: userToken },
            token: userToken,
        });
    };

    // Set default content as trending posts
    let posts = trendingrinfo?.data?.data?.posts || [];

  /*   console.log(posts, 'posttt') */

    // Conditionally render posts based on active tab
    if (activeTab === 'Liked') {
        posts = trendingrinfo?.data?.data?.liked_posts || [];
    } else if (activeTab === 'Bookmarked') {
        posts = trendingrinfo?.data?.data?.bookmarked_posts || [];
    }

    const [paginationState, setPaginationState] = useState<{ [key: string]: number }>({});

    if (trendingLoading) {
        return <Loading />;
    }

    // Ensure posts array exists
    if (!posts || posts.length === 0) {
        return (
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 font-medium">No posts available</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {posts.map((item: { id: any; likes_count: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined; is_liked_by_current_user: any; comments: { length: number; slice: (arg0: number, arg1: number) => never[]; }; content: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; images: { image: any; }[]; user_liked: any; comments_count: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; user_bookmarked: any; }) => {
                const postId = item.id;
                const postLikeData = postLikes[postId] || {
                    count: item.likes_count,
                    liked: item.is_liked_by_current_user,
                };

                // Use post-specific pagination state
                const currentPage = paginationState[postId] || 1;
                const totalComments = item.comments?.length || 0;
                const totalPages = Math.ceil(totalComments / ITEMS_PER_PAGE);
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const paginatedComments = item.comments?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

                return (
                    activeTab === 'Trending' ? (
                        <div
                            key={postId}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            {/* Post Content */}
                            <div className="mb-4">
                                <p className="text-gray-800 text-sm leading-relaxed font-normal">
                                    {item?.content}
                                </p>
                            </div>

                            {/* Post Image */}
                            {item?.images?.[0]?.image && (
                                <div className="mb-4 flex justify-center">
                                    <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                                        <Image
                                            src={`https://staging.ajiroba.ng/v1/media/${item?.images?.[0]?.image}`}
                                            alt="Post image"
                                            width={300}
                                            height={300}
                                            className="max-w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Engagement Metrics */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors"
                                    onClick={() =>
                                        !item?.user_liked
                                            ? handleLike(postId, postLikeData.liked)
                                            : handledisLike(postId, postLikeData.liked)
                                    }
                                >
                                    <FaThumbsUp
                                        className={`text-lg ${item?.user_liked ? 'text-[#F56630]' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium">
                                        {item?.likes_count} Kudos
                                    </span>
                                </button>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaRegCommentDots className="text-lg" />
                                    <span className="text-sm font-medium">
                                        {item?.comments_count} Comments
                                    </span>
                                </div>

                                <button className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors">
                                    <FaShareAlt className="text-lg" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>

                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors"
                                    onClick={() =>
                                        !item?.user_bookmarked
                                            ? handleBookMark(postId, postLikeData.liked)
                                            : handleUnBookMark(postId, postLikeData.liked)
                                    }
                                >
                                    <FiBookmark
                                        className={`text-lg ${item?.user_bookmarked ? 'text-[#F56630]' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium">Bookmark</span>
                                </button>
                            </div>

                            {/* Comment Input */}
                            <form
                                onSubmit={handleSubmit((data) => onSubmit({ ...data, post_id: postId }))}
                                className="mt-4"
                            >
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-gray-600">👤</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Write your comment"
                                        {...register('comment')}
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`imageUpload-${postId}`} className="cursor-pointer">
                                            <AiOutlinePicture className="text-xl text-gray-500 hover:text-gray-700 transition-colors" />
                                        </label>
                                        <input
                                            type="file"
                                            id={`imageUpload-${postId}`}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                                {errors.comment && (
                                    <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
                                )}

                                {selectedImage && (
                                    <div className="mt-3">
                                        <Image
                                            src={selectedImage}
                                            alt="Selected"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </form>

                            {/* Comments Section */}
                            {paginatedComments.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    {paginatedComments.map((comment: { id: React.Key | null | undefined; user: { profile_image: any; fullname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; comment: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs text-gray-600">👤</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-sm text-gray-800">
                                                            {comment?.user?.fullname}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {comment?.comment}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <button className="flex items-center gap-1 hover:text-[#F56630] transition-colors">
                                                        <FaThumbsUp className="text-sm" />
                                                        <span>0 Kudos</span>
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-[#F56630] transition-colors">
                                                        <span>Reply</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex justify-center gap-4">
                                    <button
                                        onClick={() =>
                                            setPaginationState((prevState) => ({
                                                ...prevState,
                                                [postId]: Math.max((prevState[postId] || 1) - 1, 1),
                                            }))
                                        }
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors text-sm"
                                    >
                                        Previous
                                    </button>

                                    <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setPaginationState((prevState) => ({
                                                ...prevState,
                                                [postId]: Math.min(
                                                    (prevState[postId] || 1) + 1,
                                                    totalPages,
                                                ),
                                            }))
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors text-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'Liked' ? (
                        // Similar structure for Liked posts
                        <div
                            key={postId}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            {/* Render for liked posts - same structure as Trending */}
                            <div className="mb-4">
                                <p className="text-gray-800 text-sm leading-relaxed font-normal">
                                    {item?.content}
                                </p>
                            </div>

                            {item?.images?.[0]?.image && (
                                <div className="mb-4 flex justify-center">
                                    <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                                        <Image
                                            src={`https://staging.ajiroba.ng/v1/media/${item?.images?.[0]?.image}`}
                                            alt="Post image"
                                            width={300}
                                            height={300}
                                            className="max-w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors"
                                    onClick={() =>
                                        !item?.user_liked
                                            ? handleLike(postId, postLikeData.liked)
                                            : handledisLike(postId, postLikeData.liked)
                                    }
                                >
                                    <FaThumbsUp
                                        className={`text-lg ${item?.user_liked ? 'text-[#F56630]' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium">
                                        {item?.likes_count} Kudos
                                    </span>
                                </button>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaRegCommentDots className="text-lg" />
                                    <span className="text-sm font-medium">
                                        {item?.comments_count} Comments
                                    </span>
                                </div>

                                <button className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors">
                                    <FaShareAlt className="text-lg" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>

                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors"
                                    onClick={() =>
                                        !item?.user_bookmarked
                                            ? handleBookMark(postId, postLikeData.liked)
                                            : handleUnBookMark(postId, postLikeData.liked)
                                    }
                                >
                                    <FiBookmark
                                        className={`text-lg ${item?.user_bookmarked ? 'text-[#F56630]' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium">Bookmark</span>
                                </button>
                            </div>
                        </div>
                    ) : activeTab === 'Bookmarked' ? (
                        // Similar structure for Bookmarked posts
                        <div
                            key={postId}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            {/* Render for bookmarked posts - same structure as Trending */}
                            <div className="mb-4">
                                <p className="text-gray-800 text-sm leading-relaxed font-normal">
                                    {item?.content}
                                </p>
                            </div>

                            {item?.images?.[0]?.image && (
                                <div className="mb-4 flex justify-center">
                                    <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                                        <Image
                                            src={`https://staging.ajiroba.ng/v1/media/${item?.images?.[0]?.image}`}
                                            alt="Post image"
                                            width={300}
                                            height={300}
                                            className="max-w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors"
                                    onClick={() =>
                                        !item?.user_liked
                                            ? handleLike(postId, postLikeData.liked)
                                            : handledisLike(postId, postLikeData.liked)
                                    }
                                >
                                    <FaThumbsUp
                                        className={`text-lg ${item?.user_liked ? 'text-[#F56630]' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium">
                                        {item?.likes_count} Kudos
                                    </span>
                                </button>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaRegCommentDots className="text-lg" />
                                    <span className="text-sm font-medium">
                                        {item?.comments_count} Comments
                                    </span>
                                </div>

                                <button className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors">
                                    <FaShareAlt className="text-lg" />
                                    <span className="text-sm font-medium">Share</span>
                                </button>

                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#F56630] transition-colors"
                                    onClick={() =>
                                        !item?.user_bookmarked
                                            ? handleBookMark(postId, postLikeData.liked)
                                            : handleUnBookMark(postId, postLikeData.liked)
                                    }
                                >
                                    <FiBookmark
                                        className={`text-lg ${item?.user_bookmarked ? 'text-[#F56630]' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium">Bookmark</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <p className="text-gray-500 font-medium">No data Available</p>
                        </div>
                    )
                );
            })}
        </div>
    );
};









const NotificationSidebar = () => {
    const { isLoggedIn, user, token } = useAuthStore((state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
    }));

    // const userToken = token;
    const userToken = Cookies.get("token") as string;

    const {
        data: notinfo,
        isLoading: notLoading,
        error: noterror,
        refetch: notrefetch,
    } = useGetOrderData(
        "/api/communitynotifications",
        "get_trending_posts",
        userToken,
    );

    const ITEMS_PER_PAGE = 50;

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // Extract notifications array
    const notifications = notinfo?.data?.data || [];

    // Calculate total pages
    const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);

    // Get paginated notifications
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedNotifications = notifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-lg mb-6 text-gray-800">Notifications</h4>

            {notinfo?.data?.data?.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 font-medium">No notifications available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedNotifications?.map(
                        (item: any, key: React.Key | null | undefined) => {
                            const timeAgo = formatDistanceToNow(new Date(item?.date_created), {
                                addSuffix: true,
                            });

                            return (
                                <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <p className="font-medium text-gray-800 text-sm mb-1">
                                        {item.message}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {timeAgo}
                                    </span>
                                </div>
                            );
                        },
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            currentPage === 1 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            currentPage === totalPages 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

const MainLayout = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>("Trending");

    useAuthMiddleware(router);
    return (
        <div className="w-full max-w-7xl mx-auto">
            <section className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Post Creation Form */}
                    <div>
                        <PostCreationForm />
                    </div>
                    
                    {/* Tab Component */}
                    <div>
                        <TabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    
                    {/* Posts Content */}
                    <div>
                        <ContentPost activeTab={activeTab} />
                    </div>
                </div>
                
                {/* Notifications Sidebar */}
                <div className="lg:w-80 flex-shrink-0">
                    <NotificationSidebar />
                </div>
            </section>
        </div>
    );
};

export default MainLayout;
