## 📝 Notes

- The frontend works standalone with localStorage
- Backend provides REST API for multi-user scenarios
- In-memory storage is used by default (data resets on server restart)
- Easy to extend with MongoDB, PostgreSQL, or other databases
- CORS enabled for development with external frontends

## 🔧 Customization

Replace `backend/models/boardModel.js` with database queries to add persistence across server restarts. The structure is designed to make this easy!