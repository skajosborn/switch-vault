# Switch Plan Customization Features

## Overview
The Dead Man's Switch application now includes comprehensive customization options for creating personalized safety switches. Users can choose from pre-built templates or create custom configurations with advanced features.

## New Features

### 1. Plan Templates
Three pre-built templates are available:

- **Basic Safety**: Daily check-ins with email notifications (24h interval, 12h grace period)
- **Standard Protection**: Enhanced monitoring with multiple notification channels (12h interval, 6h grace period)
- **Premium Security**: Maximum protection with advanced features (6h interval, 2h grace period)

### 2. Customizable Settings

#### Basic Configuration
- **Check-in Interval**: 1-168 hours (1 hour to 1 week)
- **Grace Period**: 0-72 hours additional time after missing a check-in
- **Plan Name**: Custom name for easy identification
- **Auto-renewal**: Automatically extend switch when checking in

#### Reminder System
- **Enable/Disable**: Turn reminders on or off
- **Frequency**: Hourly, daily, or weekly reminders
- **Advance Warning**: Set how many hours before deadline to start reminders
- **Custom Messages**: Personalized reminder content

#### Notification Channels
- **Email**: Standard email notifications
- **SMS**: Text message alerts
- **Push**: Browser push notifications
- **Slack**: Slack channel integration
- **Discord**: Discord webhook support
- **Custom Webhook**: Custom HTTP endpoint integration

### 3. Advanced Features

#### Emergency Contacts
- Add multiple email addresses for emergency notifications
- Contacts are notified when switch activates
- Easy management with add/remove functionality

#### Custom Actions
- **Types**: Email, SMS, Webhook, File Transfer, Crypto Transfer
- **Priority Levels**: Low, Medium, High, Critical
- **Configuration**: Flexible settings for each action type
- **Execution Order**: Actions execute based on priority

## User Interface

### Multi-Step Form
1. **Basic Info**: Message and plan name
2. **Customization**: All settings and options
3. **Review**: Summary before creation

### Interactive Components
- **Template Selection**: Visual cards with feature highlights
- **Real-time Updates**: See changes as you configure
- **Advanced Toggle**: Show/hide advanced features
- **Validation**: Ensure all required fields are completed

## Technical Implementation

### Data Structure
```typescript
interface CreateSwitchFormData {
  message: string;
  checkInInterval: number;
  planName: string;
  gracePeriod: number;
  reminders: ReminderSettings;
  notifications: NotificationSettings;
  autoRenewal: boolean;
  emergencyContacts: string[];
  customActions: CustomAction[];
}
```

### Components
- `SwitchPlanCustomizer`: Main customization interface
- `CreateSwitchForm`: Multi-step form with customization
- `SwitchCard`: Enhanced display of switch information

### State Management
- Local state for form data
- Real-time updates as user makes changes
- Validation and error handling
- Integration with existing switch management

## Usage Examples

### Creating a Basic Switch
1. Click "Set Up Your Switch"
2. Enter message and plan name
3. Select "Basic Safety" template
4. Review and create

### Creating a Custom Switch
1. Start with any template
2. Modify check-in interval and grace period
3. Configure reminder preferences
4. Select notification channels
5. Add emergency contacts
6. Define custom actions
7. Review and create

### Managing Existing Switches
- View all customization settings in switch cards
- See reminder and notification status
- Monitor emergency contacts and custom actions
- Check grace period and auto-renewal status

## Benefits

1. **Flexibility**: Tailor switches to specific needs
2. **Scalability**: From simple to complex configurations
3. **User Experience**: Intuitive multi-step process
4. **Professional Features**: Enterprise-level customization
5. **Safety**: Multiple notification channels ensure reliability

## Future Enhancements

- **Plan Sharing**: Share custom configurations
- **Analytics**: Track switch performance
- **Integration**: More third-party services
- **Mobile App**: Native mobile experience
- **API**: Programmatic switch creation

