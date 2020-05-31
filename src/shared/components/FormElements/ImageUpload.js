import React , {useRef,useState , useEffect} from 'react'
import './ImageUpload.css'
import Button from './Button'

const ImageUpload = (props) =>{
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] =  useState()
    const [isValid, setIsValid] = useState(false)
    const filePickerRef = useRef()

    useEffect(()=>{
        if (!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    },[file])
    const pickImageHandler = () => {
        filePickerRef.current.click()
    }
    const pickedImageHandler = (event) =>{
            let pickedFile
            let fileisValid = isValid;
        if (event.target.files && event.target.files.length === 1 ){
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileisValid = true
            console.log(pickedFile)
        } else{
            setIsValid(false)
            fileisValid= false
        }
        props.onInput(props.id, pickedFile,fileisValid)
    }
    return (
        <div className='div-control'>
            <input 
             id = {props.id}
             ref = {filePickerRef}
             style ={{display:'none'}}
             type='file'
             accept='.jpg, .png, .jpeg'
             onChange={pickedImageHandler}/>
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                {previewUrl && <img src={previewUrl} alt ="Preview"/> }
                {!previewUrl && <p>Please Select an Profile Image</p>} 
                </div>
            <Button type="button" onClick={pickImageHandler}>PICK AN IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
        

    )   
}

export default ImageUpload;