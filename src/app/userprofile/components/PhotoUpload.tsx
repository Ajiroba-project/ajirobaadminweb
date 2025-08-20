// 'use client'
// import React, { useState } from 'react';;
// import { CustomModal } from './Modal';
// import { userProfile, useAuthStore, profilePhoto } from '@/store/store';
// import { IoClose } from 'react-icons/io5';
// import { useDropzone } from 'react-dropzone';
// // import "react-toastify/dist/ReactToastify.css";
// import Cookies from 'js-cookie';

// interface FileProps {
//   name: string;
//   type: string;
//   size: number;
//   base64: string;
// }

// export const PhotoUpload = () => {
//   const { setProfile, profile } = userProfile((state) => ({
//     setProfile: state.setProfile,
//     profile: state.profile,
//   }));
//   const { token } = useAuthStore((state) => ({
//     token: state.token,
//   }));


//   const userToken = Cookies.get('token') as string;

//   const [files, setFiles] = useState<FileProps[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);

//   const { getRootProps, getInputProps, open } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       acceptedFiles.forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           setFiles([
//             {
//               name: file.name,
//               type: file.type,
//               size: file.size,
//               base64: reader.result as string,
//             },
//           ]);
//         };
//         reader.readAsDataURL(file);
//       });
//     },
//     noClick: true,
//     noKeyboard: true,
//   });

//   const closeModal = () => {
//     setProfile(false);
//     setFiles([]);
//     setUploadSuccess(false);
//   };


//   const { profileurl, setProfileurl } = profilePhoto((state) => ({
//     profileurl: state.profileurl,
//     setProfileurl: state.setProfileurl,
//   }));

//   const uploadImage = async () => {
//     if (files.length === 0) return;

//     const base64Image = files[0].base64;
//     setUploading(true);

//     try {
//       const response = await fetch('https://staging.ajiroba.ng/v1/user/change_profile_image/', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Token ${userToken}`,
//         },
//         body: JSON.stringify({
//           profile_image: base64Image,
//         }),
//       });

//       if (response.ok) {
//         const responseData = await response.json();
//         /*     console.log('Response data:', responseData); */
//         setUploadSuccess(true);
//         /*      console.log('Image uploaded successfully'); */
//         setProfile(false);
//         // console.log('Image uploaded successfully');
//         setProfileurl(responseData?.profile_image_url)
//       } else {
//         console.error('Failed to upload image');
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     } finally {
//       setUploading(false);
//       setFiles([]);
//     }
//   };

//   return (
//     <CustomModal isOpen={profile}>
//       <div className="flex justify-end">
//         <IoClose className="cursor-pointer text-xl" onClick={closeModal} />
//       </div>
//       <label htmlFor="upload" {...getRootProps()}>
//         <input {...getInputProps()} id="upload" />
//         <div className="flex w-full flex-col items-center justify-center align-middle">
//           <p>
//             <span className="brand1">Click to upload</span> or drag and drop
//           </p>
//           <p className="text-sm text-gray-300">SVG, PNG, JPG, GIF (max 800 X 400px)</p>
//         </div>
//         <div className="my-4 flex w-full items-center justify-center gap-3">
//           <hr className="w-full" />
//           <p className="text-gray-300">OR</p>
//           <hr className="w-full" />
//         </div>

//         {files.length > 0 && (
//           <div className="mt-4 text-center">
//             {files.map((val) => (
//               <div key={val.name}>
//                 {val.name} ({val.size} bytes)
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="my-2 flex w-full flex-col items-center justify-center">

//           <button onClick={files.length === 0 ? open : uploadImage} disabled={uploading} type="button" className="rounded-md bg-[#f25e26] px-8 py-4 text-white">
//             {files.length === 0 ? "Browse files" : "Upload"}
//           </button>
//         </div>
//       </label>

//       {uploading && (
//         <div className="mt-4 text-center">
//           <p>Uploading...</p>
//         </div>
//       )}
//       {uploadSuccess && (
//         <div className="mt-4 text-center">
//           <p>Image uploaded successfully!</p>
//         </div>
//       )}
//     </CustomModal>
//   );
// };



'use client'
import React, { useState } from 'react';;
import { CustomModal } from './Modal';
import { userProfile, useAuthStore, profilePhoto } from '@/store/store';
import { IoClose } from 'react-icons/io5';
import { useDropzone } from 'react-dropzone';
// import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

interface FileProps {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export const PhotoUpload = () => {
  const { setProfile, profile } = userProfile((state) => ({
    setProfile: state.setProfile,
    profile: state.profile,
  }));
  const { token } = useAuthStore((state) => ({
    token: state.token,
  }));


  const userToken = Cookies.get('token') as string;

  const [files, setFiles] = useState<FileProps[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFiles([
            {
              name: file.name,
              type: file.type,
              size: file.size,
              base64: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg']
    },
    maxSize: 1 * 1024 * 1024, // 1MB limit
    minSize: 1024, // 1KB minimum
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            alert(`File ${file.name} is too large. Maximum size is 1MB.`);
          } else if (error.code === 'file-too-small') {
            alert(`File ${file.name} is too small. Minimum size is 1KB.`);
          } else if (error.code === 'file-invalid-type') {
            alert(`File ${file.name} has an invalid type. Only images are allowed.`);
          } else {
            alert(`Error with file ${file.name}: ${error.message}`);
          }
        });
      });
    },
  });

  const closeModal = () => {
    setProfile(false);
    setFiles([]);
    setUploadSuccess(false);
    setApiError(null);
  };


  const { profileurl, setProfileurl } = profilePhoto((state) => ({
    profileurl: state.profileurl,
    setProfileurl: state.setProfileurl,
  }));

  const uploadImage = async () => {
    if (files.length === 0) return;

    const base64Image = files[0].base64;
    setUploading(true);
    setApiError(null); // Clear any previous errors

    try {
      const response = await fetch('https://staging.ajiroba.ng/v1/user/change_profile_image/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({
          profile_image: base64Image,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        /*     console.log('Response data:', responseData); */
        setUploadSuccess(true);
        /*      console.log('Image uploaded successfully'); */
        setProfile(false);
        // console.log('Image uploaded successfully');
        setProfileurl(responseData?.profile_image_url)
      } else {
        // Handle API errors
        const errorMessage = responseData?.message || responseData?.error || `Upload failed with status: ${response.status}`;
        setApiError(errorMessage);
        console.error('Failed to upload image:', responseData);
      }
    } catch (error) {
      // Handle network errors
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setApiError(errorMessage);
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  return (
    <CustomModal isOpen={profile}>
      <div className="flex justify-end">
        <IoClose className="cursor-pointer text-xl" onClick={closeModal} />
      </div>
      <label htmlFor="upload" {...getRootProps()}>
        <input {...getInputProps()} id="upload" />
        <div className="flex w-full flex-col items-center justify-center align-middle">
          <p>
            <span className="brand1">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-300">SVG, PNG, JPG, GIF (max 1MB, min 1KB)</p>
        </div>
        <div className="my-4 flex w-full items-center justify-center gap-3">
          <hr className="w-full" />
          <p className="text-gray-300">OR</p>
          <hr className="w-full" />
        </div>

        {files.length > 0 && (
          <div className="mt-4 text-center">
            {files.map((val) => (
              <div key={val.name}>
                {val.name} ({val.size} bytes)
              </div>
            ))}
          </div>
        )}

        <div className="my-2 flex w-full flex-col items-center justify-center">

          <button onClick={files.length === 0 ? open : uploadImage} disabled={uploading} type="button" className="rounded-md bg-[#f25e26] px-8 py-4 text-white">
            {files.length === 0 ? "Browse files" : "Upload"}
          </button>
        </div>
      </label>

      {uploading && (
        <div className="mt-4 text-center">
          <p>Uploading...</p>
        </div>
      )}
      {uploadSuccess && (
        <div className="mt-4 text-center">
          <p className="text-green-600">Image uploaded successfully!</p>
        </div>
      )}
      {apiError && (
        <div className="mt-4 text-center">
          <p className="text-red-600 text-sm">{apiError}</p>
        </div>
      )}
    </CustomModal>
  );
};
