'use client'
import { useState } from 'react';
import { DefaultButton } from '@/app/components/Button';
import { InputField } from '@/app/components/FormField';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface GiftPointModalProps {
    email: string;
    onClose: () => void;
}

export const GiftPointModal = ({ email, onClose }: GiftPointModalProps) => {
    const [points, setPoints] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!points || isNaN(Number(points))) {
            toast.error('Please enter a valid number of points');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/gift_points/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    point: points
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                onClose();
            } else {
                toast.error(data.message || 'Failed to gift points');
            }
        } catch (error) {
            toast.error('An error occurred while gifting points');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            <h2 className="text-xl font-semibold text-center">Enter Gift Point</h2>
            <div className="w-full">
                <InputField
                    type="number"
                    value={points}
                    label=''
                    name=''

                    placeholder="Enter points"
                    classname="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                />
            </div>
            <div className="flex gap-4 justify-center">
                <DefaultButton
                    text="Send Gift Point"
                    type="button"
                    handleClick={handleSubmit}
                    className="bg-[#E84526] text-white px-6 py-2 rounded hover:bg-[#d13d21]"
                    disabled={isSubmitting}
                />
                <DefaultButton
                    text="Cancel"
                    type="button"
                    handleClick={onClose}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
                />
            </div>
        </div>
    );
};