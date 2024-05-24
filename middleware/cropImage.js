import sharp from 'sharp';
import express from 'express';
import path from 'path';
import fs from 'fs';



export const cropImageMiddleware = async (req, res, next) => {
    try {
        // Assuming the image path is passed as a query parameter named 'image'
        const imagePath = '../customer/images/' + decodeURIComponent(req.query.image);
        const outputPath = '../customer/cropped-images/' + req.query.image; // Output path for the cropped image

        // Perform image cropping using sharp
        await sharp(imagePath)
            .resize({ width: 200, height: 200 }) // Set the desired width and height for cropping
            .toFile(outputPath);

        // Save the path of the cropped image in the request object
        req.croppedImagePath = outputPath;
        next(); // Proceed to the next middleware
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

