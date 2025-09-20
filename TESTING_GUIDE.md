# 🧪 Supabase Migration Testing Guide

## Quick Start

### 1. Run Setup Script
```bash
npm run setup:supabase
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Visit Test Page
Open your browser and go to: **http://localhost:3000/test-supabase**

## Test Endpoints

### Database Tests
**URL**: `GET /api/test-supabase`

**What it tests**:
- ✅ Database connection
- ✅ All table access (users, enrollments, courses, progress, guidance, payments, subscriptions)
- ✅ Row Level Security configuration
- ✅ Environment variables

**Response Example**:
```json
{
  "success": true,
  "results": {
    "timestamp": "2024-12-01T10:30:00Z",
    "tests": [
      {
        "name": "Database Connection",
        "status": "PASS",
        "message": "Successfully connected to Supabase database"
      }
    ],
    "summary": {
      "total": 10,
      "passed": 10,
      "failed": 0
    }
  }
}
```

### Enrollment Test
**URL**: `POST /api/test-enrollment`

**What it tests**:
- ✅ Enrollment creation in Supabase
- ✅ Data insertion and retrieval
- ✅ Database constraints and validation

**Response Example**:
```json
{
  "success": true,
  "message": "Test enrollment created successfully",
  "enrollment": {
    "id": "uuid-here",
    "email": "test@example.com",
    "child_name": "Test Child",
    "status": "completed"
  }
}
```

## Test Page Features

### 🎯 Interactive Testing
- **Run Database Tests**: Tests all database connections and table access
- **Test Enrollment**: Creates a sample enrollment to verify data insertion
- **Real-time Results**: See test results with pass/fail indicators
- **Detailed Logs**: View error messages and debugging information

### 📊 Visual Dashboard
- **Test Summary**: Overview of total, passed, and failed tests
- **Individual Results**: Detailed results for each test with icons
- **Error Details**: Expandable error information for debugging
- **Timestamp**: Track when tests were last run

### 🚀 Setup Guidance
- **Step-by-step Instructions**: Clear guidance for Supabase setup
- **Useful Links**: Direct links to Supabase dashboard and documentation
- **Environment Check**: Validates that all required environment variables are set

## Manual Testing Checklist

### Authentication Flow
- [ ] User registration via API
- [ ] User login via API
- [ ] Password reset functionality
- [ ] Session management

### Payment Processing
- [ ] Payment initialization
- [ ] Payment verification
- [ ] User account creation after payment
- [ ] Enrollment data storage

### User Management
- [ ] Profile retrieval
- [ ] Profile updates
- [ ] User status management

### Guidance System
- [ ] Student list retrieval
- [ ] Screen time settings
- [ ] PIN management
- [ ] Focus mode configuration

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
**Error**: "Database connection failed"
**Solution**: 
- Check Supabase project URL and API keys
- Verify Supabase project is active
- Ensure migration script has been run

#### 2. Table Access Failed
**Error**: "Table access failed"
**Solution**:
- Run the migration script in Supabase SQL Editor
- Check table names match the schema
- Verify RLS policies are properly configured

#### 3. Environment Variables Missing
**Error**: "Missing environment variables"
**Solution**:
- Update `.env.local` with your Supabase credentials
- Restart the development server
- Verify variable names match exactly

#### 4. RLS Policy Issues
**Error**: "RLS configuration issue"
**Solution**:
- Check Row Level Security policies in Supabase
- Verify service role key has proper permissions
- Review RLS policies in the migration script

### Debug Mode

Enable detailed logging by adding to your `.env.local`:
```env
DEBUG=supabase:*
```

### API Testing with curl

#### Test Database Connection
```bash
curl http://localhost:3000/api/test-supabase
```

#### Test Enrollment Creation
```bash
curl -X POST http://localhost:3000/api/test-enrollment
```

## Performance Testing

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create artillery config
cat > artillery-config.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Test Supabase APIs"
    requests:
      - get:
          url: "/api/test-supabase"
      - post:
          url: "/api/test-enrollment"
EOF

# Run load test
artillery run artillery-config.yml
```

### Database Performance
- Monitor query execution times in Supabase Dashboard
- Check for slow queries and optimize indexes
- Review connection pool usage

## Success Criteria

### ✅ Migration Complete When:
- [ ] All database tests pass (10/10)
- [ ] Test enrollment creates successfully
- [ ] Authentication flow works end-to-end
- [ ] Payment processing completes without errors
- [ ] All API endpoints respond correctly
- [ ] No console errors in browser
- [ ] Performance meets or exceeds Firebase baseline

### 📈 Performance Targets:
- **API Response Time**: < 200ms for simple queries
- **Database Connection**: < 100ms
- **Authentication**: < 500ms
- **Payment Processing**: < 2s

## Next Steps After Testing

1. **Data Migration**: Migrate existing Firebase data to Supabase
2. **Production Deployment**: Deploy to staging/production environment
3. **Monitoring Setup**: Configure error tracking and performance monitoring
4. **Documentation Update**: Update all documentation with Supabase references
5. **Team Training**: Train team on new Supabase patterns and tools

## Support

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [API Reference](./API_REFERENCE.md)

### Getting Help
- Check the test page for detailed error messages
- Review Supabase Dashboard for database issues
- Consult the migration guide for setup instructions
- Test individual components to isolate issues

---

*Happy testing! 🚀*
