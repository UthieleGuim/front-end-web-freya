import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

interface DropzoneProps {
    onFileUploaded: (file: File) => void;
}

export function Dropzone({ onFileUploaded }: DropzoneProps) {
    const [selectedFileUrl, setSelectedFileUrl] =  useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded]);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg']
        }
    })

    return ( 
        <div className="h-[300px] bg-[#E1FAEC] rounded-lg flex items-center justify-center mt-12 outline-0" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            { selectedFileUrl 
                ? <img className="w-full h-full object-cover" src={selectedFileUrl} alt="Point images"/>
                : (
                    <p className="w-[90%] h-[80%] rounded-lg border-2 border-dashed flex flex-col justify-center items-center text-[#333]">
                        <FiUpload size={24} className="text-[#4ECB79] mb-2"/>
                        Imagem do Produto
                    </p>
                )
            }
        </div>
    )
}