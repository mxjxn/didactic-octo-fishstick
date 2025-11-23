# Contributing to Farcaster Risk Game

Thank you for your interest in contributing to the Farcaster Risk Game! This guide will help you get set up for development.

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 10.8.2
- **(Optional) Foundry** for smart contract development

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mxjxn/didactic-octo-fishstick.git
cd didactic-octo-fishstick
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all packages in the monorepo.

### 3. Set Up Environment Variables

#### Backend Configuration

```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` and add your Neynar API key:
```env
PORT=4000
NEYNAR_API_KEY=your_neynar_api_key_here
```

Get your Neynar API key at: https://neynar.com

#### Frontend Configuration

```bash
cd apps/frontend
cp .env.example .env
```

The default configuration should work for local development:
```env
VITE_API_URL=http://localhost:4000/api
```

#### Database Configuration (Optional)

```bash
cd packages/database
cp .env.example .env
```

For SQLite (default):
```env
DATABASE_URL="file:./dev.db"
```

Generate Prisma client:
```bash
npm run db:generate
npm run db:push
```

## 🏗️ Development

### Running the Full Stack

From the root directory:

```bash
npm run dev
```

This will start:
- Frontend dev server on http://localhost:3000
- Backend API server on http://localhost:4000

### Running Individual Apps

#### Frontend Only
```bash
cd apps/frontend
npm run dev
```

#### Backend Only
```bash
cd apps/backend
npm run dev
```

#### Database Studio (Prisma)
```bash
cd packages/database
npm run db:studio
```

### Building

Build all packages:
```bash
npm run build
```

Build specific package:
```bash
cd apps/frontend
npm run build
```

### Linting

Lint all packages:
```bash
npm run lint
```

## 📁 Project Structure

```
├── apps/
│   ├── frontend/          # React + Vite + Farcaster SDK
│   ├── backend/           # Express API
│   └── contracts/         # Foundry contracts (placeholder)
├── packages/
│   ├── game-logic/        # Core game mechanics
│   └── database/          # Prisma schema
```

## 🧪 Testing

Currently, the project does not have comprehensive tests. Contributing tests is highly welcome!

```bash
npm run test
```

## 🎮 Game Logic

The core game logic is in `packages/game-logic/src/`:

- **game.ts** - Game state management, attack/fortify/placement logic
- **territories.ts** - Territory definitions and continent bonuses
- **types.ts** - TypeScript interfaces

### Adding New Features

1. **Frontend**: Add UI components in `apps/frontend/src/components/`
2. **Backend**: Add API routes in `apps/backend/src/routes/`
3. **Game Logic**: Modify game mechanics in `packages/game-logic/src/`
4. **Database**: Update schema in `packages/database/prisma/schema.prisma`

## 🔧 Common Tasks

### Add a New Territory

1. Edit `packages/game-logic/src/territories.ts`
2. Add the territory to `INITIAL_TERRITORIES`
3. Update neighbor connections
4. Rebuild: `npm run build`

### Add a New API Endpoint

1. Create route in `apps/backend/src/routes/`
2. Add service method in `apps/backend/src/services/GameService.ts`
3. Update frontend API client in `apps/frontend/src/services/api.ts`

### Update Database Schema

1. Edit `packages/database/prisma/schema.prisma`
2. Run migration:
   ```bash
   cd packages/database
   npm run db:migrate
   ```

## 🐛 Debugging

### Frontend Issues

- Check browser console for errors
- Verify API URL in `.env`
- Check network tab for failed API calls

### Backend Issues

- Check terminal output for errors
- Verify Neynar API key is set
- Test endpoints with curl or Postman

### Build Issues

- Clear caches: `npm run clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be >= 18)

## 🤝 Pull Request Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run build: `npm run build`
5. Run linter: `npm run lint`
6. Commit your changes: `git commit -am 'Add my feature'`
7. Push to the branch: `git push origin feature/my-feature`
8. Submit a pull request

## 💡 Ideas for Contributions

- [ ] Add comprehensive tests
- [ ] Implement card system from Risk
- [ ] Add game replay functionality
- [ ] Create admin dashboard
- [ ] Improve UI/UX design
- [ ] Add sound effects and animations
- [ ] Implement AI opponents
- [ ] Add tournament bracket system
- [ ] Mobile responsive design
- [ ] Docker setup for easy deployment

## 📚 Resources

- [Farcaster Documentation](https://docs.farcaster.xyz/)
- [Neynar API Docs](https://docs.neynar.com/)
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Risk Game Rules](https://www.hasbro.com/common/instruct/risk.pdf)

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues for solutions
- Join discussions in pull requests

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
