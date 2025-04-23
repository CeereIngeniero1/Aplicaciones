@echo off
set "hora_lanzamiento=7:29:47"

:loop
rem Obtén la hora actual
for /f "tokens=1-4 delims=:. " %%a in ("%time%") do (
    set "hora_actual=%%a:%%b:%%c"
)

rem Imprime la hora actual para verificar
echo Hora actual: %hora_actual%

rem Compara la hora actual con la hora de lanzamiento
if "%hora_actual%" == "%hora_lanzamiento%" (
    rem Lanza la aplicación (reemplaza "ruta\de\tu_aplicacion.exe" por la ruta de tu aplicación)
    start "" "C:\Aplicaciones\.bat\505485\Colle505485_Fernando_Reorga.bat"
    exit
)

rem Espera un segundo antes de volver a verificar
timeout /t 1 >nul
goto loop
