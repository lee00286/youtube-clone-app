import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';

import { Typography, Button, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

// Public 드롭다운 메뉴에 사용
const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
];

// Category 드롭다운 메뉴에 사용
const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" }
];

function VideoUploadPage(props) {
    const user = useSelector(state => state.user); // state에서 user을 가져오면 user 변수에 정보가 저장됨

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    // VideoTitle의 값을 변경
    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value); // event.currentTarget은 입력창에 입력된 텍스트 값을 가짐
    };
    // Description의 값을 변경
    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    };
    // Private의 값을 변경
    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value); // event.currentTarget은 입력창에 입력된 텍스트 값을 가짐
    };
    // Category의 값을 변경
    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value);
    };

    // 비디오 업로드하는 함수
    const onDrop = (files) => { // files 인수에는 파일의 정보가 담겨있음 (array 형식)
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        };
        console.log(files);
        formData.append("file", files[0]);

        Axios.post('/api/video/uploadfiles', formData, config) // 서버에 post request를 보냄
            .then(response => {
                if (response.data.success) {
                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    };

                    setFilePath(response.data.filePath);

                    // Generate thumbnail with this filePath
                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.thumbsFilePath);
                            }
                            else {
                                alert('썸네일 생성에 실패 했습니다.');
                            }
                        });
                } else {
                    alert('비디오 업로드를 실패 했습니다.');
                }
            });
    };

    const onSubmit = (event) => {
        event.preventDefault(); // 클릭하면 하려고 했던 걸 방지하고 아래의 코드 실행

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        };
        
        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 업로드를 했습니다.');
                    setTimeout(() => {
                        props.history.push('/');
                    }, 3000);
                } else {
                    alert('비디오 업로드에 실패 했습니다.');
                }
            });
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            
            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Video drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false} // 한 번에 여러 개의 파일을 올릴지
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <PlusOutlined style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>
                <br /><br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br /><br />
                <select onChange={onPrivateChange}>
                    {/* Map method를 이용해 드롭다운 메뉴 만들기 */}
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <select onChange={onCategoryChange}>
                    {/* Map method를 이용해 드롭다운 메뉴 만들기 */}
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default VideoUploadPage;