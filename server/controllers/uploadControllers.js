import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


// Initialize the R2 client
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `${process.env.R2_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY
  },
  forcePathStyle: true
});


export const generateUploadUrl = async (req, res) => {

    const {contentType} = req.body
    try {
        // Make sure the user is authenticated
        if (!req.admin) {
            return res.status(401).json({success : false, message :  "Unauthorized"});
        }

        // Validate request
        if (!contentType) {
            return res.status(400).json({success : false, message :  "Content type is required"});
        }

        const email = req.admin.email;
        const fileName = `file-${req.admin.email}-${Date.now()}`;

        // Create the object path with user-specific folder
        const putCommand = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `uploads/users/${email}/${fileName}`,
            ContentType: contentType,  
        });

        // Generate the pre-signed URL with 5-minute expiry
        const url = await getSignedUrl(r2Client, putCommand, { expiresIn: 7200 });

        return res.status(200).json({success : true , message :  "Pre-signed upload URL generated", 
            fileName: fileName, 
            filePath: `uploads/users/${email}/${fileName}`,
            signedUrl: url 
        });

    } catch (error) {
        console.error('Error generating upload URL:', error);
        return res.status(500).json({message :  "Failed to generate upload URL", success : false});
    }
};

/**
 * Generate pre-signed URLs for multiple file uploads
 */
export const generateMultipleUploadUrls = async (req, res) => {
    try {
        // Make sure the user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({success : false, message : "Unauthorized"});
        }

        const { files } = req.body; // Array of {contentType, size}
        
        // Validate request
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({success : false, message : "Files array is required"});
        }
        
        // Limit number of files per request
        if (files.length > 10) {
            return res.status(400).json({success : false, message :  "Maximum 10 files allowed per request"});
        }
        
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint', // .ppt
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
            'text/plain'
];

        const maxSize = 10 * 1024 * 1024; // 10MB
        
        const id = req.user.id;
        
        const uploadUrls = await Promise.all(
            files.map(async (file, index) => {
                // Validate file type
                if (!allowedTypes.includes(file.contentType)) {
                    throw new Error(`Invalid file type at index ${index}`);
                }
                
                // Validate file size
                if (file.size > maxSize) {
                    throw new Error(`File size too large at index ${index}`);
                }
                
                // Generate unique filename
                const timestamp = Date.now();
                const fileName = `file-${id}-${timestamp}-${index}`;
                const filePath = `uploads/users/${id}/${fileName}`;
                
                // Create upload command
                const putCommand = new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: filePath,
                    ContentType: file.contentType,
                });
                
                // Generate pre-signed URL
                const signedUrl = await getSignedUrl(r2Client, putCommand, { expiresIn: 300 });
                
                return {
                    fileName,
                    filePath,
                    signedUrl,
                    contentType: file.contentType
                };
            })
        );
        
        return res.status(200).json({success : true, message  : "Pre-signed upload URLs generated", 
            uploads: uploadUrls
    });

    } catch (error) {
        console.error('Error generating multiple upload URLs:', error);
        return res.status(500).json({message :  "Failed to generate upload URLs", success : false});
    }
};

/**
 * Generate a pre-signed URL for downloading a file
 */
// export const generateDownloadUrl = async (req, res) => {
//     try {
//         const { filePath } = req.params;
        
//         if (!filePath) {
//             return res.status(400).json(new ApiResponse(400, "File path is required", null));
//         }

//         // Create the get command
//         const getCommand = new GetObjectCommand({
//             Bucket: process.env.R2_BUCKET_NAME,
//             Key: filePath,
//         });

//         // Generate pre-signed URL with 15-minute expiry
//         const url = await getSignedUrl(r2Client, getCommand, { expiresIn: 900 });

//         return res.status(200).json(new ApiResponse(200, "Pre-signed download URL generated", { 
//             downloadUrl: url 
//         }));

//     } catch (error) {
//         console.error('Error generating download URL:', error);
//         return res.status(500).json(new ApiResponse(500, "Failed to generate download URL", null, error.message));
//     }
// };
