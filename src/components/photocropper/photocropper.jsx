import React, { useState, useCallback } from 'react';
import {
    getCroppedImg,
    getRotatedImage,
    getCroppedImgas64Util
  } from './canvasutils'
  import Cropper from 'react-easy-crop';
import ImgDialog from './imgdialog';
import PropTypes from 'prop-types';
import { getOrientation } from 'get-orientation/browser';

const PhotoCropper = (props) => {

    function readFile (file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.addEventListener('load', () => resolve(reader.result), false);
          reader.readAsDataURL(file);
        })
      }
    
      const ORIENTATION_TO_ANGLE = {
        3: 180,
        6: 90,
        8: -90
      }
    
      const [imageSrc, setImageSrc] = React.useState(null);
      const [crop, setCrop] = useState({ x: 0, y: 0 });
      const [rotation] = useState(0);
      const [zoom, setZoom] = useState(1);
      const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
      const [croppedImage, setCroppedImage] = useState(null);

      const triggerFileSelectPopup = useCallback(async (e) => {
        e.preventDefault();
        try {
          const croppedImage = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
            rotation
          );
          const croppedImageBlob = await getCroppedImgas64Util(imageSrc, croppedAreaPixels, rotation)
          setCroppedImage(croppedImage);
          setCroppedImage(null);
          setImageSrc(null);
          props.ReturnImage({FinalImage: croppedImage, Blob:croppedImageBlob});
        } catch (e) {
          console.error(e);
        }
      }, [imageSrc, croppedAreaPixels, rotation]);

      const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }, [])

      const onClose = useCallback(() => {
        setCroppedImage(null);
      }, []);

      const exitFileSelect = (e) => {
        e.preventDefault();
        setImageSrc(null);
      }

      const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          let imageDataUrl = await readFile(file);
          // apply rotation if needed
          const orientation = await getOrientation(file);
          const rotation = ORIENTATION_TO_ANGLE[orientation];
          if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
          }
          setImageSrc(imageDataUrl);
        }
      }

return (
    <>
    {imageSrc
            ? (
              <React.Fragment>
                <div className="crop-container">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    zoomSpeed={0.05}
                    aspect={props.width / props.length}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    width={50}
                  />
                </div>
                <ImgDialog img={croppedImage} onClose={onClose} />
                <div className="crop-container-buttons">
                  <button className="crop-button button-action" onClick={(e) => triggerFileSelectPopup(e)}>Choose</button>
                  <button className="exit-button button-cancel" onClick={(e) => exitFileSelect(e)}>Cancel</button>
                </div>
              </React.Fragment>
            )
            : ( <></> )
          }
              <div className='input-pair'>
                {imageSrc
                  ? (
                    <React.Fragment></React.Fragment>
                  )
                  : ( 
                    <>
                      <input type="file" onChange={onFileChange} accept="image/*" /> 
                    </>
                  )}
              </div>
    </>
)
}

export default PhotoCropper;

PhotoCropper.propTypes = {
    img: PropTypes.string,
    classes: PropTypes.object,
    onClose: PropTypes.func,
    description: PropTypes.string,
    ReturnImage: PropTypes.func,
    width: PropTypes.number,
    length: PropTypes.number
  }