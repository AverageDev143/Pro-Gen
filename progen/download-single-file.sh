#!/bin/bash
# Pro-Gen Single File Download Script
# This script creates a standalone single-file version of Pro-Gen

set -e

echo "🔧 Pro-Gen Single File Generator"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "public/index.html" ] || [ ! -f "public/main.js" ] || [ ! -f "public/style.css" ]; then
    echo "❌ Error: Please run this script from the progen directory"
    echo "   Expected files not found in public/"
    exit 1
fi

OUTPUT_FILE="progen-standalone.html"

echo "📦 Reading source files..."

# Read the files
HTML_FILE="public/index.html"
CSS_FILE="public/style.css"
JS_FILE="public/main.js"

# Check if files exist
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ Error: $HTML_FILE not found"
    exit 1
fi

if [ ! -f "$CSS_FILE" ]; then
    echo "❌ Error: $CSS_FILE not found"
    exit 1
fi

if [ ! -f "$JS_FILE" ]; then
    echo "❌ Error: $JS_FILE not found"
    exit 1
fi

echo "✅ All source files found"
echo ""

# Create the combined file
echo "🔗 Combining files into single HTML..."

# Create the standalone file
cat > "$OUTPUT_FILE" << 'HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro-Gen - 3D Modeling</title>
    <style>
HEADER

# Add CSS
cat "$CSS_FILE" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'MIDDLE1'
    </style>
</head>
<body>
MIDDLE1

# Extract body content from index.html (everything between <body> and </body>)
sed -n '/<body>/,/<\/body>/p' "$HTML_FILE" | sed '1d;$d' >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'MIDDLE2'

    <script type="module">
        import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
        import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
        
MIDDLE2

# Add the main.js content (without the import lines since we added them above)
tail -n +3 "$JS_FILE" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'FOOTER'
    </script>
</body>
</html>
FOOTER

echo "✅ Standalone file created: $OUTPUT_FILE"
echo ""

# Get file size
FILE_SIZE=$(wc -c < "$OUTPUT_FILE")
FILE_SIZE_MB=$(awk "BEGIN {printf \"%.2f\", $FILE_SIZE / 1048576}")

echo "📊 Statistics:"
echo "   - Total size: ${FILE_SIZE_MB}MB ($FILE_SIZE bytes)"
echo "   - Output file: $(pwd)/$OUTPUT_FILE"
echo ""
echo "✨ Done! You can now open $OUTPUT_FILE in any modern browser."
echo "   No installation or build process required!"
