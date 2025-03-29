import React, { useState } from 'react'

const AddPost = ({ type }) => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState('');
    const [filePrev, setFilePrev] = useState('');
    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setFile(file);
            setFilePrev(reader.result);
        };
    };
    return (
        <div>
            <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                    <form className='flex flex-col gap-4 items-center justify-between mb-4'>
                        <input type="text" className='custom-input' placeholder='Enter Caption' 
                        value={caption} onChange={e => setCaption(e.target.value)}/>
                        <input type="file" className='custom-input' accept={type === 'post' ? "image/*" : "video/*"} onChange={changeFileHandler}/>
                        {filePrev && <>
                        {type==='post'?<img src={filePrev}/>:<video 
                        controlsList='nodownload'
                        controls
                        src={filePrev}
                        className='h-[450px] w-[300px]'
                        />}
                        </>}
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                            + Add Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPost