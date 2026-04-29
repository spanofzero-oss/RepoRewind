# RepoRewind
By using predeterministic state-tracking, we've eliminated 'Merge Hell' and the 'Staging Area' entirely. It's a zero-footprint, peer-to-peer versioning system that runs on your phone as easily as a server. Don't manage your code—just record it. It's Git, without the Git.

## Setup

### Backend (Hugging Face Spaces)
1. Create a new Hugging Face Space at https://huggingface.co/spaces
2. Choose "Docker" as the SDK
3. Upload the files from the `backend/` directory: `app.py`, `requirements.txt`, `Dockerfile`
4. Your space URL will be something like `https://your-username-repo-rewind-backend.hf.space`

### Frontend
The frontend is a React component. You can integrate it into a Next.js app or deploy to Vercel/Netlify.

Update the `API_URL` in `frontend/SamaranWorkspace.jsx` to your Hugging Face Space URL.

For example:
```javascript
const API_URL = "https://your-username-repo-rewind-backend.hf.space";
```
