'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import Loading from './Loading';
import Cookies from "js-cookie";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlinePicture } from "react-icons/ai";

const PostCreationForm = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    interface ImageFile extends File { }

    interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> { }

    const userToken = Cookies.get('token') as string;

    const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!userToken) {
                console.error('Authentication token not found');
                alert('Authentication token not found. Please log in again.');
                setIsLoading(false);
                return;
            }

            // Convert images to base64
            const imagePromises = images.map(image =>
                new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        // The result is a base64 string
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(image);
                })
            );

            const base64Images = await Promise.all(imagePromises);

            // Create the request body with proper structure for post_images
            const requestBody = {
                content: content,
                post_images: base64Images.map(base64 => [base64.split(',')[1]])  // Array of arrays
            };

            const response: Response = await fetch('https://staging.ajiroba.ng/v1/admin/create_post/', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // Rest of your code remains the same
            if (response.ok) {
                setContent('');
                setImages([]);
                alert('Post created successfully');
            } else if (response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('authToken');
            } else if (response.status === 403) {
                alert('You are not authorized to perform this action.');
            } else {
                console.error('Failed to create post');
                alert('Failed to create post. Please try again later.');
            }
        } catch (error: unknown) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    interface HandleImageChangeEvent extends React.ChangeEvent<HTMLInputElement> { }

    // When handling image changes:
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // Your handleImageChange function should be creating URLs
    const handleImageChange = (e: HandleImageChangeEvent): void => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages(prevImages => [...prevImages, ...newImages]);

            // Create and store URLs for the new images
            const newUrls = newImages.map(file => URL.createObjectURL(file));
            setImageUrls(prevUrls => [...prevUrls, ...newUrls]);
        }
    };

    // Properly implemented removeImage function that updates both arrays
    const removeImage = (index: number): void => {
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(imageUrls[index]);

        // Remove the image from both arrays
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Add emoji"
                        >
                            <BsEmojiSmile className="h-5 w-5" />
                        </button>

                        <label className="p-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                            <AiOutlinePicture className="h-5 w-5" />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type here..."
                        className="flex-1 py-2 px-3 outline-none text-gray-700 bg-transparent border-none focus:ring-0"
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !content}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isLoading || !content
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#F25e26] text-white hover:bg-[#d94a1a]'
                        }`}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </button>
                </div>

                {/* Image preview section */}
                {images.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-3">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white">
                                        <Image
                                            src={imageUrls[index]}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                            width={80}
                                            height={80}
                                            unoptimized
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PostCreationForm;