
# SafeTravel - Safe Tourism Platform

A full-stack application for safe travel planning with real-time crime data, hospital locations, hotel recommendations, and intelligent route optimization.

## Overview

SafeTravel helps travelers plan safer journeys by providing:
- **Crime Data Analysis**: Access UK crime statistics via data.police.uk API
- **Medical Facilities**: Find nearby hospitals and medical centers using OpenStreetMap data
- **Safe Accommodations**: Locate hotels and lodging in secure areas
- **Route Optimization**: Calculate shortest or safest routes with risk scoring
- **Journey Planning**: Save and manage your travel itineraries

## Tech Stack

- **Frontend**: React + Vite, React Router, Tailwind CSS, Leaflet (maps), Axios
- **Backend**: Node.js + Express, PostgreSQL, express-session
- **APIs**: 
  - Nominatim (geocoding)
  - Overpass API (OpenStreetMap data)
  - OSRM (routing)
  - data.police.uk (UK crime data)

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Replit PostgreSQL or external provider)

## Database Setup

### Option 1: Replit PostgreSQL (Recommended for Replit)

1. Open the "Database" tab in your Repl
2. Click "Create a database" and select PostgreSQL
3. Copy the `DATABASE_URL` from the env section
4. Add it to your `server/.env` file

### Option 2: External PostgreSQL

Free PostgreSQL providers:
- [Neon](https://neon.tech/) - Serverless Postgres with generous free tier
- [Supabase](https://supabase.com/) - Postgres with additional features
- [ElephantSQL](https://www.elephantsql.com/) - Classic managed Postgres

Steps:
1. Create a database instance
2. Get the connection string (DATABASE_URL)
3. Add it to `server/.env`

### Initialize Database Schema

After setting up your database, create the tables:

```bash
# If using Replit PostgreSQL
psql $DATABASE_URL < schema.sql

# Or connect manually and run schema.sql contents
```

The schema creates tables for:
- `users` - User accounts with authentication
- `favorites` - Saved places (hospitals, hotels, etc.)
- `journeys` - Saved travel routes and itineraries

## Installation & Setup

### 1. Environment Configuration

Create `server/.env` file (see `server/.env.example`):

```env
DATABASE_URL=postgresql://user:password@host:5432/database_name
SESSION_SECRET=your-strong-random-secret-key-here
```

**Important**: 
- Use a strong random string for `SESSION_SECRET` in production
- Never commit `.env` to version control

### 2. Install Dependencies

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd client
npm install
```

Required packages are defined in `package.json` files and will be auto-installed by Replit.

## Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
node server.js
```
Server runs on `http://0.0.0.0:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Vite dev server runs on `http://localhost:5173`

### Replit Deployment

On Replit, the application auto-deploys when you:
1. Click the "Run" button (configure in `.replit` if needed)
2. Use Replit's built-in deployment features

**Port Configuration:**
- Backend: Port 5000 (forwarded to 80/443 in production)
- Frontend: Port 5173 (development) or served via backend in production

## API Endpoints

### Authentication
- `POST /auth/signup` - Create account (name, email, password)
- `POST /auth/login` - User login (email, password)
- `GET /auth/me` - Get current session
- `GET /auth/logout` - End session

### Places (OpenStreetMap)
- `GET /places?lat=<lat>&lng=<lng>&type=<type>`
  - Types: `tourist`, `hotel`, `hospital`
  - Returns nearby places within 2000m radius

### Crime Data (UK Only)
- `GET /crime?lat=<lat>&lng=<lng>&radius=<meters>`
  - Returns crime statistics and safety scores
  - **Limitation**: UK only (England, Wales, Northern Ireland)

### Routes
- `POST /route`
  - Body: `{ waypoints: [{lat, lng}, ...], mode: "car|foot|bike", pathType: "shortest|safest" }`
  - Returns route geometry, distance, duration, risk score
  - **Note**: "safest" path is approximate (samples points along route)

### User Data
- `GET /user/favorites` - Get saved favorites
- `POST /user/favorites` - Add favorite place
- `DELETE /user/favorites/:id` - Remove favorite
- `GET /user/journeys` - Get saved journeys
- `POST /user/journeys` - Save a journey

## External API Rate Limits & Limitations

### 1. Nominatim Geocoding API
- **Rate Limit**: 1 request per second
- **Usage Policy**: Must have valid User-Agent header
- **Recommendation**: Implement caching for repeated queries
- **Documentation**: https://operations.osmfoundation.org/policies/nominatim/

### 2. Overpass API (OpenStreetMap Data)
- **Rate Limit**: Fair use policy, typically 2-3 requests per second
- **Timeout**: Queries must complete within 180 seconds
- **Heavy Use**: May result in temporary IP blocks
- **Recommendation**: Cache results, avoid redundant queries
- **Documentation**: https://wiki.openstreetmap.org/wiki/Overpass_API

### 3. OSRM Routing API
- **Rate Limit**: Public demo server has generous limits for development
- **Production**: Consider self-hosting or paid tier for high traffic
- **Documentation**: http://project-osrm.org/

### 4. data.police.uk Crime Data API
- **Coverage**: UK ONLY (England, Wales, Northern Ireland)
- **Update Frequency**: Monthly data releases (1-2 month lag)
- **Rate Limit**: Reasonable use policy
- **Historical Data**: Limited to ~3 years
- **Limitation**: No real-time data, aggregated statistics only
- **Documentation**: https://data.police.uk/docs/

**Important Notes:**
- Crime data is UK-specific and won't work for other countries
- Crime "safety scores" are naive calculations for demonstration
- Production use should implement proper caching and error handling

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── HospitalCard.jsx
│   │   │   └── HotelCard.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Hospitals.jsx
│   │   │   ├── Hotels.jsx
│   │   │   └── Crime.jsx
│   │   ├── lib/           # Utilities
│   │   │   └── geocode.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── index.html
├── server/                # Backend Express application
│   ├── routes/           # API route handlers
│   │   ├── places.js
│   │   ├── crime.js
│   │   ├── route.js
│   │   └── user.js
│   ├── auth.js           # Authentication logic
│   ├── db.js             # Database connection
│   ├── server.js         # Express server setup
│   └── .env.example      # Environment template
├── schema.sql            # PostgreSQL schema
└── README.md
```

## Security & Best Practices

### Authentication
- Passwords hashed with bcrypt (10 salt rounds)
- Session-based auth with httpOnly cookies
- CORS configured for development (localhost:5173)

### Production Checklist
- [ ] Set `SESSION_SECRET` to strong random value
- [ ] Enable `secure: true` for session cookies (HTTPS)
- [ ] Update CORS origin to production domain
- [ ] Implement rate limiting on API endpoints
- [ ] Add request logging and monitoring
- [ ] Use connection pooling for database
- [ ] Cache external API responses
- [ ] Add error tracking (e.g., Sentry)

## Development Tips

### CORS Issues
If you encounter CORS errors:
1. Verify frontend URL matches CORS origin in `server/server.js`
2. Ensure `credentials: true` is set in both axios calls and CORS config
3. Check that session cookies are being sent (`withCredentials: true`)

### Port Conflicts
- Backend default: 5000
- Frontend default: 5173
- If ports are in use, kill processes or configure different ports

### Database Connection
If database connection fails:
1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Ensure schema has been initialized
4. Test connection: `psql $DATABASE_URL -c "SELECT 1;"`

### Replit-Specific Notes
- Database tab provides managed PostgreSQL
- Use `0.0.0.0` instead of `localhost` for server binding
- Port 5000 is forwarded to 80/443 in production deployments
- Environment variables can be set in Replit Secrets tab
- Persistent storage is available in Replit's file system

## Troubleshooting

### "Failed to fetch" errors
- Check that backend server is running on port 5000
- Verify CORS configuration matches frontend URL
- Ensure `withCredentials: true` in axios calls

### Session not persisting
- Verify `SESSION_SECRET` is set in `.env`
- Check cookie settings (sameSite, secure)
- Ensure axios uses `withCredentials: true`

### Map not displaying
- Verify Leaflet CSS is imported in HTML
- Check console for JavaScript errors
- Ensure MapView component receives valid coordinates

### Crime data not working
- Verify location is in UK (England/Wales/Northern Ireland)
- Check data.police.uk API status
- Review API rate limits

## Future Enhancements

Potential improvements for production:
- Real-time crime data integration (where available)
- Advanced route optimization with graph algorithms
- Multi-country crime data support
- Mobile app (React Native)
- Real-time collaboration features
- Integration with travel booking APIs
- Weather data integration
- Emergency contact information by region

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Check existing documentation
- Review API documentation for external services
- Check Replit community forums
- Open an issue with detailed error information

---

Built with ❤️ for safer travel experiences
