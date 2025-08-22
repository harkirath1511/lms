import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiResponse } from "../utils/api.response.js";

// export const s3Client = new S3Client({
//     region: "ap-south-1",
//     credentials: {
//         accessKeyId: process.env.ACCESSKEYID_S3,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY_S3,
//     }
// });



export const r2Client = new S3Client({
  region: "auto",
  endpoint: ${process.env.END_POINT},
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY,   // from the dialog
    secretAccessKey: process.env.R2_SECRET_KEY
  },
  forcePathStyle: true
});

export const putObject = async (req, res) => {
    try {
        const id = req.user.id;
        const fileName = image-${req.user.id}-${Date.now()};

        const putCommand = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: uploads/userUploads/${id}/${fileName},
            ContentType: req.body.contentType,  
        });

        const url = await getSignedUrl(r2Client, putCommand, { expiresIn: 60 });

        return res.status(200).json(new ApiResponse(200, "Pre-signed URL generated successfully", { 
            fileName: fileName, 
            signedUrl: url 
        }));

    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error", null, error.message));
    }
};

export const putMultipleObjects = async (req, res) => {
    try {
        const { files } = req.body; // Array of {contentType, size}
        
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json(new ApiResponse(400, "Files array is required"));
        }
        
        if (files.length > 5) {
            return res.status(400).json(new ApiResponse(400, "Maximum 5 files allowed per request"));
        }
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        const uploadUrls = await Promise.all(
            files.map(async (file, index) => {
                if (!allowedTypes.includes(file.contentType)) {
                    throw new Error(`Invalid file type at index ${index}`);
                }
                
                if (file.size > maxSize) {
                    throw new Error(`File size too large at index ${index}`);
                }
                
                const fileName = image-${req.user.id}-${Date.now()}-${index};
                
                const putCommand = new PutObjectCommand({
                    Bucket: process.env.BUCKET_NAME,
                    Key: uploads/userUploads/${fileName},
                    ContentType: file.contentType,
                });
                
                const signedUrl = await getSignedUrl(r2Client, putCommand, { expiresIn: 300 });
                
                return {
                    fileName,
                    signedUrl,
                    contentType: file.contentType
                };
            })
        );
        
        return res.status(200).json(new ApiResponse(200, "Pre-signed URLs generated successfully", {
            uploads: uploadUrls
        }));

    } catch (error) {
        console.error('Error generating multiple pre-signed URLs:', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error", null, error.message));
    }
};
