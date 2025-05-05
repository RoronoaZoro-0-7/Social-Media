import React, { useState } from 'react';
import { PostData } from '../context/PostContext.jsx';
import { LoadingAnimation } from '../pages/Loading.jsx';

const AddPost = ({ type }) => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState('');
    const [filePrev, setFilePrev] = useState('');
    const { addPost, addLoading } = PostData();

    const changeFileHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (filePrev) URL.revokeObjectURL(filePrev); // Cleanup previous preview URL

        setFile(selectedFile);
        setFilePrev(URL.createObjectURL(selectedFile));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("caption", caption);
        formdata.append("file", file);
        addPost(formdata, setFile, setFilePrev, setCaption, type);
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <form onSubmit={submitHandler} className="flex flex-col gap-4 items-center">
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Enter Caption"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        className="custom-input"
                        accept={type === 'post' ? "image/*" : "video/*"}
                        onChange={changeFileHandler}
                        required
                    />
                    {filePrev && (
                        type === 'post'
                            ? <img src={filePrev} alt="Preview" className="max-w-full max-h-64" />
                            : <video
                                controlsList="nodownload"
                                controls
                                src={filePrev}
                                className="h-[450px] w-[300px]"
                            />
                    )}
                    <button
                        type="submit"
                        disabled={addLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                        {addLoading ? <LoadingAnimation /> : "+ Add Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPost;
