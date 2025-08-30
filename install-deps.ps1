Write-Host "Installing Tailwind CSS v3 dependencies..." -ForegroundColor Green
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host "Now run: npm run dev" -ForegroundColor Yellow
Read-Host "Press Enter to continue" 