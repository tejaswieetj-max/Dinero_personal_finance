#!/bin/bash

echo "Deploying Dinero React SPA..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "Build successful! Ready for deployment."
    echo "Deploy the 'dist' folder to your hosting provider."
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi

echo "Deployment preparation complete!"
