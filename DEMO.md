# Dead Man's Switch Demo Guide

This guide will walk you through how to use the Dead Man's Switch application.

## Getting Started

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

## How to Use

### 1. Create Your First Switch

1. Click the **"Create New Switch"** button
2. Enter a message that you want to be sent if you don't check in
3. Set the check-in interval (how often you need to check in)
4. Click **"Create Switch"**

**Example Message**: "If you're reading this, I haven't checked in for 24 hours. Please check on me at [your address] or call [emergency contact]."

### 2. Monitor Your Switch

- **Green Border**: Switch is active and you have time remaining
- **Yellow Border**: Switch is active but getting close to expiration (within 1 hour)
- **Red Border**: Switch has expired
- **Gray Border**: Switch is inactive

### 3. Check In Regularly

- Click the **"Check In"** button before your deadline
- This resets the timer and extends your deadline
- The switch will remain active as long as you keep checking in

### 4. What Happens When You Don't Check In

- The switch automatically expires when the deadline is missed
- The status changes to "EXPIRED"
- The switch becomes inactive
- **Note**: Currently, this is a frontend-only demo. In a real implementation, you would integrate with email/SMS services to actually send the message.

## Demo Scenarios

### Scenario 1: Daily Check-in
- Set interval to 24 hours
- Check in once per day
- Perfect for solo travelers or remote workers

### Scenario 2: Emergency Contact
- Set interval to 12 hours
- Check in twice per day
- Good for elderly individuals or people with health concerns

### Scenario 3: Business Continuity
- Set interval to 48 hours
- Check in every other day
- Useful for business owners or project managers

## Safety Features

- **Automatic Expiration**: Switches automatically expire when deadlines are missed
- **Real-time Updates**: Status updates every minute
- **Local Storage**: All data is saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## Important Notes

⚠️ **This is a demonstration application**. In a real-world scenario, you would need to:

1. **Integrate with messaging services** (email, SMS, Slack, etc.)
2. **Add user authentication** for security
3. **Implement cloud storage** for data persistence
4. **Add notification systems** for recipients
5. **Include message templates** and recipient management

## Troubleshooting

- **Switch not updating**: Refresh the page to reload from localStorage
- **Timer not accurate**: Check your system clock and timezone settings
- **Data not saving**: Ensure cookies and localStorage are enabled in your browser

## Next Steps

To make this a production-ready application, consider:

1. **Backend API**: Create a server to handle message delivery
2. **Database**: Store switches and user data securely
3. **Authentication**: Add user accounts and security
4. **Integrations**: Connect with email, SMS, and messaging platforms
5. **Monitoring**: Add logging and analytics
6. **Mobile App**: Create native mobile applications

## Support

For questions or issues, please refer to the main README.md file or create an issue in the project repository.
