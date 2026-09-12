#!/bin/bash
# Pro-Gen Auto-Setup Script
# This script creates a standalone single-file version of Pro-Gen
# No installation required - runs directly in your browser!

set -e

echo "🚀 Pro-Gen Auto-Setup"
echo "====================="
echo ""
echo "Creating lightweight standalone version..."
echo ""

OUTPUT_FILE="progen-standalone.html"

# Check if we're in the right directory
if [ ! -f "public/index.html" ] || [ ! -f "public/main.js" ] || [ ! -f "public/style.css" ]; then
    echo "❌ Error: Please run this script from the progen directory"
    echo "   Expected files not found in public/"
    exit 1
fi

# Read the source files
CSS_CONTENT=$(cat public/style.css)
HTML_BODY=$(sed -n '/<body>/,/<\/body>/p' public/index.html | sed '1d;$d')
JS_CONTENT=$(tail -n +3 public/main.js)

# Create the standalone HTML file
cat > "$OUTPUT_FILE" << 'HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro-Gen - Lightweight 3D Modeling</title>
    <style>
HEADER

echo "$CSS_CONTENT" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'MIDDLE1'
    </style>
</head>
<body>
MIDDLE1

echo "$HTML_BODY" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'MIDDLE2'

    <script type="module">
        import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
        import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
        
MIDDLE2

echo "$JS_CONTENT" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'FOOTER'
    </script>
</body>
</html>
FOOTER

# Get file size
FILE_SIZE=$(wc -c < "$OUTPUT_FILE")
FILE_SIZE_KB=$(awk "BEGIN {printf \"%.0f\", $FILE_SIZE / 1024}")

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📦 Output: $OUTPUT_FILE (${FILE_SIZE_KB}KB)"
echo ""
echo "🎯 How to use:"
echo "   1. Open $OUTPUT_FILE in any modern browser (Chrome, Firefox, Edge)"
echo "   2. No installation, no Node.js, no dependencies needed!"
echo "   3. Start creating 3D models immediately"
echo ""
echo "🔥 Features:"
echo "   - 20+ primitive shapes"
echo "   - Heat analysis for electronics design"
echo "   - Real-time property editing"
echo "   - Export capabilities"
echo "   - Runs entirely in your browser"
echo ""
echo "✨ The lightest possible runtime - just your browser!"
echo ""
