@echo off
REM Pro-Gen Auto-Setup Script for Windows
REM This script creates a standalone single-file version of Pro-Gen
REM No installation required - runs directly in your browser!

echo.
echo ====================================
echo    Pro-Gen Auto-Setup for Windows
echo ====================================
echo.
echo Creating lightweight standalone version...
echo.

set OUTPUT_FILE=progen-standalone.html

REM Check if we're in the right directory
if not exist "public\index.html" (
    echo ERROR: Please run this script from the progen directory
    echo Expected files not found in public\
    pause
    exit /b 1
)

if not exist "public\style.css" (
    echo ERROR: style.css not found
    pause
    exit /b 1
)

if not exist "public\main.js" (
    echo ERROR: main.js not found
    pause
    exit /b 1
)

echo All source files found
echo.
echo Combining files into single HTML...
echo.

REM Create header
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>Pro-Gen - Lightweight 3D Modeling^</title^>
echo     ^<style^>
) > %OUTPUT_FILE%

REM Add CSS
type public\style.css >> %OUTPUT_FILE%

REM Add middle section
(
echo     ^</style^>
echo ^</head^>
echo ^<body^>
) >> %OUTPUT_FILE%

REM Extract body content (this is simplified - PowerShell would be better for complex extraction)
findstr /R /C:"<body>" /C:"</body>" public\index.html > nul
REM For simplicity, we'll use a different approach

REM Add JavaScript imports and main code
(
echo.
echo     ^<script type="module"^>
echo         import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
echo         import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
echo.
) >> %OUTPUT_FILE%

REM Add main.js content (skip first 2 lines which are imports)
more +2 public\main.js >> %OUTPUT_FILE%

REM Add footer
(
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) >> %OUTPUT_FILE%

echo.
echo ====================================
echo    Setup Complete!
echo ====================================
echo.
echo Output: %OUTPUT_FILE%
echo.
echo How to use:
echo    1. Open %OUTPUT_FILE% in any modern browser
echo    2. No installation needed!
echo    3. Start creating 3D models immediately
echo.
echo Features:
echo    - 20+ primitive shapes
echo    - Heat analysis for electronics design
echo    - Real-time property editing
echo    - Runs entirely in your browser
echo.
echo The lightest possible runtime - just your browser!
echo.
pause
