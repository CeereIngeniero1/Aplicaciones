
cd /d "C:\Aplicaciones"
del /f /q .git\refs\remotes\origin\main
git fetch --all
git reset --hard origin/main
git pull origin main
pause