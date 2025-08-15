# Dead Man's Switch Frontend

A modern Next.js React application that implements a dead man's switch system. Users can create messages that will be automatically sent if they don't check in within a specified time period.

## Features

- **Message Creation**: Create custom messages to be sent if you don't check in
- **Configurable Timers**: Set check-in intervals from 1 hour to 1 week
- **Real-time Status**: Visual indicators showing active, expired, and inactive switches
- **Automatic Expiration**: Switches automatically expire when the deadline is missed
- **Local Storage**: All data is persisted locally in the browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Built-in dark/light theme support

## How It Works

1. **Create a Switch**: Enter your message and set how often you need to check in
2. **Stay Active**: Click "Check In" before your deadline to extend the timer
3. **Automatic Action**: If you miss a check-in, the switch expires and can trigger your predefined action

## Use Cases

- **Emergency Contacts**: Ensure loved ones are notified if something happens to you
- **Business Continuity**: Automate important business communications
- **Digital Estate Planning**: Share passwords or important information posthumously
- **Safety Monitoring**: Regular check-ins for solo travelers or remote workers

## Technology Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with responsive design
- **Icons**: Lucide React for clean, consistent iconography
- **TypeScript**: Full type safety and better development experience
- **Local Storage**: Browser-based data persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd dead-mans-switch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main dead man's switch interface
│   └── globals.css     # Global styles and Tailwind imports
├── components/         # Reusable React components (future)
└── types/             # TypeScript type definitions (future)
```

## Future Enhancements

- [ ] Email/SMS integration for actual message delivery
- [ ] Multiple recipient support
- [ ] Message templates
- [ ] Advanced scheduling options
- [ ] User authentication and cloud sync
- [ ] API endpoints for external integrations
- [ ] Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for educational and personal use. The developers are not responsible for any consequences resulting from the use of this software. Always ensure you have proper legal and ethical considerations when implementing automated messaging systems.
