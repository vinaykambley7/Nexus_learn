@echo off
title Push NexusLearn to GitHub
color 0B
echo ===================================================
echo   Pushing NexusLearn to GitHub (vinaykambley7/Nexus_learn)
echo ===================================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.
echo Executing: git push -u origin main
echo.
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ===================================================
    echo   SUCCESS! Pushed cleanly to GitHub.
    echo   You can now import into Vercel at vercel.com
    echo ===================================================
) else (
    color 0C
    echo ===================================================
    echo   If prompted, sign in via browser or enter a PAT.
    echo ===================================================
)
echo.
pause
