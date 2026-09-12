# Pro-Gen Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (frontend)
npm run dev

# Run API server (backend)
npm run server

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Project Structure

```
progen/
├── public/              # Frontend source files
│   ├── index.html       # Main HTML structure
│   ├── style.css        # Styles with dark theme
│   └── main.js          # Three.js 3D engine logic
├── api/
│   └── server.js        # Express backend with all APIs
├── test/
│   └── test.js          # Test suite
├── dist/                # Production build output (generated)
├── node_modules/        # Dependencies (generated)
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite build configuration
├── eslint.config.js     # ESLint configuration
├── .prettierrc.js       # Prettier configuration
└── README.md            # User documentation
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server on port 3000 |
| `npm run server` | Start Express API server on port 3001 |
| `npm run build` | Build production-ready files to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite using Node.js test runner |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Auto-format code with Prettier |
| `npm start` | Build and start production server |

## Code Quality

### ESLint Configuration
- Browser globals for frontend code
- Node.js globals for API code
- THREE.js marked as readonly global
- Unused variables flagged as errors (except those starting with `_`)

### Prettier Configuration
- 4 space indentation
- Single quotes
- 100 character line width
- Trailing commas (ES5 style)

### Running Checks
```bash
# Check for issues
npm run lint

# Auto-fix formatting
npm run format
```

## Testing

Tests are located in `test/test.js` and cover:
- Thermal analysis logic
- Material configuration validation
- Export format generation (STL, OBJ, STEP)
- G-Code generation
- API endpoint structure

Run tests with:
```bash
npm test
```

## Building for Production

The build process:
1. Bundles JavaScript with Vite
2. Optimizes Three.js as a separate chunk
3. Minifies code with esbuild
4. Outputs to `dist/` folder

```bash
npm run build
npm run server  # Serve on port 3001
```

## API Endpoints

All endpoints are documented in the main README.md. Key endpoints:

- `GET /api/health` - Health check
- `POST /api/ai-generate` - AI model generation
- `POST /api/thermal-analysis` - Thermal analysis
- `POST /api/send-to-machine` - Send to manufacturing machine
- `POST /api/plugins/register` - Register a plugin
- `GET /api/plugins` - List registered plugins
- `POST /api/export` - Export model in various formats

## Debugging

### Frontend Issues
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify Vite dev server is running
4. Clear browser cache if needed

### Backend Issues
1. Check terminal output from `npm run server`
2. Verify port 3001 is available
3. Test endpoints with curl or Postman
4. Check CORS settings if using custom domain

### Common Issues

**Frontend won't load:**
```bash
npm run dev
# Should show: http://localhost:3000
```

**API not responding:**
```bash
npm run server
# Should show server startup message
```

**Build fails:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Format code: `npm run format`
7. Submit a pull request

## License

ISC License - See LICENSE file for details.
