# Synthetic Workforce Simulator - Frontend

A modern Next.js 15 frontend for the Synthetic Workforce Simulator, built with TypeScript, Tailwind CSS, ShadCN UI, and Clerk authentication.

## Features

- 🎨 **Modern UI**: Futuristic design with neon accents and smooth animations
- 🌓 **Theme Support**: Light and dark mode with persistent theme state
- 🔐 **Authentication**: Full Clerk integration with protected routes
- 📊 **Real-time Updates**: Long-polling for simulation updates
- 📈 **Charts & Analytics**: Beautiful data visualization with Recharts
- 🎭 **Multi-Agent Interface**: Chat-like interface for agent interactions
- 💾 **State Management**: Zustand for global state
- 🔄 **Data Fetching**: SWR for efficient data fetching

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Authentication**: Clerk
- **Charts**: Recharts
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── simulation/        # Simulation pages
│   ├── what-if/          # What-if analysis page
│   ├── memory/           # Memory viewer page
│   ├── settings/         # Settings page
│   ├── pricing/          # Pricing page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── navbar.tsx        # Navigation bar
│   ├── sidebar.tsx       # Sidebar navigation
│   ├── theme-toggler.tsx # Theme switcher
│   └── ...
├── lib/                   # Utilities and API client
│   ├── api.ts           # API wrapper
│   └── utils.ts         # Utility functions
├── store/                # Zustand stores
│   ├── theme-store.ts   # Theme state
│   └── simulation-store.ts # Simulation state
└── ...
```

## Pages

- **Landing Page** (`/`): Public landing page with features and FAQ
- **Dashboard** (`/dashboard`): View and manage active simulations
- **Simulation** (`/simulation`): Start a new simulation
- **Simulation Workspace** (`/simulation/[sessionId]`): Chat-like interface for running simulations
- **What-If Analysis** (`/what-if`): Analyze alternative scenarios
- **Memory Viewer** (`/memory`): View conversation history and agent memories
- **Settings** (`/settings`): User account and theme settings
- **Pricing** (`/pricing`): Pricing plans page

## API Integration

The frontend integrates with the backend API through the `lib/api.ts` wrapper:

- `POST /simulate/start` - Start a new simulation
- `POST /simulate/next` - Execute next turn
- `POST /simulate/what-if` - Run what-if analysis
- `GET /simulate/{sessionId}` - Get simulation state
- `GET /agents/list` - List available agents
- `GET /memory/{sessionId}` - Get session memory

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

The project includes a `vercel.json` configuration file.

### Environment Variables

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL`

## Performance Optimizations

- Code splitting with Next.js App Router
- Image optimization
- Lazy loading components
- Optimized bundle size
- Efficient re-renders with React hooks

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## SEO

- Metadata configuration
- Open Graph tags
- Structured data
- Sitemap generation

## License

MIT

# SynthForce-fe
