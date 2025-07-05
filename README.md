# FlyAway ✈️

A modern, full-stack flight booking application built with Ruby on Rails and React that provides comprehensive flight search, booking, and payment capabilities. The platform integrates with Amadeus API for real-time flight data and Stripe for secure payment processing.

## 🚀 Features

### 🔍 **Flight Search & Discovery**
- **Real-time Flight Search**: Powered by Amadeus API for live flight data
- **Smart Location Autocomplete**: Airport, city, and location suggestions with IATA code integration
- **Multi-criteria Filtering**: Filter by airlines, stops, departure times, and travel duration
- **Price History Analysis**: Historical price trends to help users make informed decisions
- **Flexible Sorting**: Sort by price, duration, stops, or best value algorithm

### ✈️ **Advanced Flight Features**
- **Round-trip & One-way**: Support for both trip types
- **Multi-stop Flights**: Handle direct, one-stop, and multiple-stop itineraries
- **Flight Details**: Comprehensive flight information including amenities, baggage, and layovers
- **Real-time Pricing**: Live price confirmation and availability checking
- **Carrier Information**: Airline logos, names, and flight numbers

### 💳 **Booking & Payment System**
- **Secure Booking Flow**: Multi-step booking process with form validation
- **Guest & Authenticated Bookings**: Support for both logged-in users and guests
- **Stripe Integration**: Secure payment processing with multiple payment methods
- **Booking Confirmations**: Email confirmations and booking reference numbers
- **Payment Status Tracking**: Real-time payment status updates

### 👤 **User Management**
- **User Authentication**: Powered by Devise with JWT tokens
- **User Dashboard**: View upcoming flights and booking history
- **Traveler Information**: Store and manage passenger details
- **Email Notifications**: Booking confirmations and updates

### 🌍 **Localization & Experience**
- **Multi-currency Support**: Dynamic currency conversion and display
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live search results and booking status updates
- **Interactive Maps**: Location visualization and point of interest integration

## 🛠️ Technology Stack

### **Backend**
- **Framework**: Ruby on Rails 7.1.4
- **Database**: PostgreSQL
- **Authentication**: Devise + Devise API (JWT)
- **Server**: Puma
- **Background Jobs**: Rails Active Job
- **Email**: Action Mailer with booking notifications

### **Frontend**
- **Framework**: React 18 + Vite
- **UI Library**: Material-UI (MUI) v6
- **State Management**: React Context + TanStack Query
- **Routing**: React Router
- **Forms**: Custom form handling with validation
- **Styling**: SCSS with custom design system

### **External APIs & Services**
- **Flight Data**: Amadeus API (Search, Pricing, Booking)
- **Payments**: Stripe Payment Intents
- **Flight Tracking**: Flightradar API for airport details
- **Location Services**: OpenCage API for geocoding

### **Development & Deployment**
- **Containerization**: Docker with multi-stage builds
- **Deployment**: Fly.io platform
- **Testing**: Rails built-in testing framework
- **Environment**: Ruby 3.2.2, Node.js

## 🏗️ Architecture

```
flyaway/
├── app/                    # Rails application logic
│   ├── controllers/        # API controllers (v1 namespaced)
│   │   └── api/v1/        # Versioned API endpoints
│   │       ├── search_controller.rb    # Flight search endpoints
│   │       └── booking_controller.rb   # Booking & payment endpoints
│   ├── models/            # Data models and API integrations
│   │   ├── amadeus_api.rb            # Amadeus API wrapper
│   │   ├── amadeus_faraday_api.rb    # Advanced Amadeus integration
│   │   ├── flight_booking.rb         # Booking model
│   │   └── user.rb                   # User authentication
│   ├── services/          # Business logic services
│   │   └── flight_booking_service.rb # Booking data processing
│   └── mailers/           # Email notification system
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── flights/   # Flight search & display components
│   │   │   ├── booking/   # Booking flow components
│   │   │   ├── contexts/  # React Context providers
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   └── apicalls/  # API integration functions
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── styles/        # SCSS styling system
│   │   └── constants.js   # Configuration constants
├── config/               # Rails configuration
│   ├── routes.rb         # API routing configuration
│   ├── database.yml      # Database configuration
│   └── initializers/     # App initializers (CORS, Stripe, Devise)
└── db/                   # Database schema and migrations
```

## 🚦 Getting Started

### Prerequisites
- **Ruby**: 3.2.2+
- **Node.js**: 18+
- **PostgreSQL**: 12+
- **API Keys**: Amadeus API, Stripe (for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flyaway
   ```

2. **Backend Setup**
   ```bash
   # Install Ruby dependencies
   bundle install
   
   # Setup database
   rails db:create
   rails db:migrate
   rails db:seed
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

4. **Environment Configuration**
   Create `.env` files with required API keys:
   ```bash
   # Rails .env
   AMADEUS_API_KEY=your_amadeus_key
   AMADEUS_API_SECRET=your_amadeus_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Client .env
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Rails API server
   rails server
   
   # Terminal 2 - React development server
   cd client && npm run dev
   ```

6. **Access the Application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Backend (Rails)
rails server              # Start Rails API server
rails console             # Rails console for debugging
rails test                # Run Rails tests
rails db:migrate          # Run database migrations

# Frontend (React)
npm run dev               # Start Vite development server
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Run ESLint
```

## 📊 API Integration

### Amadeus Flight API
The application integrates with multiple Amadeus API endpoints:

- **Flight Offers Search**: Real-time flight availability and pricing
- **Flight Offers Pricing**: Price confirmation and availability validation
- **Flight Create Order**: Booking confirmation and PNR generation
- **Airport & City Search**: Location autocomplete functionality
- **Flight Price History**: Historical pricing analytics

### Stripe Payment Processing
- **Payment Intents**: Secure payment processing
- **Multiple Payment Methods**: Cards, wallets, and bank transfers
- **Real-time Status**: Payment confirmation and error handling

## 🎨 Design Features

### User Interface
- **Modern Design**: Clean, intuitive interface with MUI components
- **Responsive Layout**: Mobile-first design that scales beautifully
- **Interactive Elements**: Smooth animations and real-time feedback
- **Accessibility**: ARIA labels and keyboard navigation support

### Flight Display
- **Visual Flight Cards**: Clear departure/arrival times and airline information
- **Price Indicators**: Color-coded pricing with currency localization
- **Filter Sidebar**: Advanced filtering with real-time results
- **Detailed View**: Expandable flight details with amenities and baggage info

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
RAILS_MASTER_KEY=...
```

**Frontend (.env)**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3000
```

### Customization Options
- **Currency Settings**: Modify supported currencies in localization context
- **Flight Filters**: Adjust filter options in flight search components
- **Email Templates**: Customize booking confirmation emails
- **API Rate Limits**: Configure Amadeus API call frequency

## 📈 Performance Optimizations

- **Caching Strategy**: Local storage for flight offers and user preferences
- **Lazy Loading**: Components load only when needed
- **API Optimization**: Efficient data fetching with TanStack Query
- **Image Optimization**: Airline logos and assets optimized for web
- **Bundle Splitting**: Code splitting for faster initial load times

## 🧪 Testing

### Backend Testing
```bash
rails test                # Run all Rails tests
rails test:models         # Test models only
rails test:controllers    # Test controllers only
```

### Frontend Testing
```bash
npm test                  # Run React component tests
npm run test:coverage     # Generate coverage reports
```

**Test Coverage Includes:**
- **API Integration Tests**: Amadeus and Stripe API interactions
- **Model Tests**: User authentication and booking logic
- **Controller Tests**: API endpoint functionality
- **Component Tests**: React component behavior

## 🚀 Deployment

### Fly.io Deployment
The application is configured for deployment on Fly.io:

```bash
# Deploy to Fly.io
fly deploy

# Check deployment status
fly status

# View logs
fly logs
```

### Docker Support
```bash
# Build Docker image
docker build -t flyaway .

# Run container
docker run -p 3000:3000 flyaway
```

## 🐛 Troubleshooting

### Common Issues

**API Connection Errors:**
- Verify Amadeus API credentials are correct
- Check API rate limits and quotas
- Ensure network connectivity to Amadeus servers

**Payment Processing Issues:**
- Confirm Stripe keys are properly configured
- Check webhook endpoints for payment confirmations
- Verify test vs production key usage

**Database Connection:**
- Ensure PostgreSQL is running
- Check database credentials and permissions
- Run pending migrations: `rails db:migrate`

**Frontend Build Errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a pull request

### Development Guidelines
- Follow Rails conventions and best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is a personal portfolio project demonstrating modern web development practices with Rails and React.

## 🏆 Key Achievements

- ✅ **Full-Stack Integration**: Seamless Rails API + React frontend
- ✅ **Real-time Data**: Live flight search with Amadeus API
- ✅ **Secure Payments**: PCI-compliant Stripe integration
- ✅ **Modern Architecture**: RESTful API with JWT authentication
- ✅ **Responsive Design**: Mobile-first responsive interface
- ✅ **Production Ready**: Dockerized deployment on Fly.io
- ✅ **Type Safety**: Comprehensive error handling and validation
- ✅ **User Experience**: Intuitive booking flow with real-time feedback

## 📞 API Limitations

Due to Amadeus API restrictions in development mode:
- Limited airport/city coverage
- Reduced flight offer results
- Test booking confirmations only
- Geographic restrictions may apply

**Known Working Destinations:** Berlin, London, Istanbul, New York, Los Angeles, Shanghai, Bangkok, Rome, Paris, and more major international airports.

---

**Built with ❤️ using Ruby on Rails, React, and modern web technologies**