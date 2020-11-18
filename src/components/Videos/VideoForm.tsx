import React, { ChangeEvent, FormEvent, useState, useEffect} from "react";
import { Video } from "./Videos";
import * as videoService from './VideoService'
import {toast} from 'react-toastify'
import {useHistory, useParams} from 'react-router-dom'

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

interface Params {
  id: string
}

const VideoForm = () => {

    const history = useHistory()
    const params = useParams<Params>()

    const initialState = {
      title: "",
      description: "",
      url: "",
    }

  const [video, setVideo] = useState<Video>(initialState);

  const handeInputChange = (e: InputChange) => {
    setVideo({...video, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!params.id) {
      await videoService.createVideos(video)
      toast.success('New video created')
      setVideo(initialState)
    } else {
      await videoService.updateVideo(params.id, video)
    }

    history.push('/')
  }

  const getVideo = async (id: string) => {
    const res = await videoService.getVideo(id)
    console.log(res)
    const { title, description, url} = res.data;
    setVideo({ title, description, url})
  }

  useEffect(() => {
    if (params.id) getVideo(params.id)
  }, [params.id])

  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
            <h3>New Video</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  placeholder="write a title for this video"
                  className="form-control"
                  onChange={handeInputChange}
                  autoFocus
                  value={video.title}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="url"
                  placeholder="https://"
                  className="form-control"
                  onChange={handeInputChange}
                  value={video.url}
                />
              </div>

              <div className="form-group">
                <textarea
                  name="description"
                  rows={3}
                  className="form-control"
                  placeholder="write a description"
                  onChange={handeInputChange}
                  value={video.description}
                ></textarea>
              </div>

              {
                params.id ? 
                <button className="btn btn-info">Update Video</button>
                :
                <button className="btn btn-primary">Create </button>
              }
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;
