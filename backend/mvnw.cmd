@echo off
setlocal

cd /d "%~dp0"

set "LOCAL_MAVEN=%CD%\.tools\apache-maven-3.9.9\bin\mvn.cmd"
if exist "%LOCAL_MAVEN%" (
    call "%LOCAL_MAVEN%" "-Dmaven.repo.local=%CD%\.m2\repository" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    call mvn "-Dmaven.repo.local=%CD%\.m2\repository" %*
    exit /b %ERRORLEVEL%
)

echo Maven nao encontrado.
echo Instale o Maven ou mantenha a pasta .tools dentro de backend.
echo Depois rode novamente: .\mvnw.cmd spring-boot:run
exit /b 1
