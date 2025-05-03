import React, { useState } from 'react'
import { PostData } from '../context/PostContext.jsx'

const AddPost = ({ type }) => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState('');
    const [filePrev, setFilePrev] = useState('');
    const { addPost } = PostData();
    const changeFileHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (filePrev) URL.revokeObjectURL(filePrev);  // cleanup previous blob

        setFile(selectedFile);
        setFilePrev(URL.createObjectURL(selectedFile));
    };


    const submitHandler = (e) => {
        const formdata = new FormData();
        formdata.append("caption", caption);
        formdata.append("file", file);
        e.preventDefault();
        addPost(formdata, setFile, setFilePrev, setCaption, type);
    }
    return (
        <div>
            <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                    <form onSubmit={submitHandler} className='flex flex-col gap-4 items-center justify-between mb-4'>
                        <input type="text" className='custom-input' placeholder='Enter Caption'
                            value={caption} onChange={e => setCaption(e.target.value)} />
                        <input type="file" className='custom-input' accept={type === 'post' ? "image/*" : "video/*"} onChange={changeFileHandler} />
                        {filePrev && <>
                            {type === 'post' ? <img src={filePrev} /> : <video
                                controlsList='nodownload'
                                controls
                                src={filePrev}
                                className='h-[450px] w-[300px]'
                            />}
                        </>}
                        <button onClick={submitHandler} className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                            + Add Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPost