# Project Details

## API Endpoints

### Posts

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | /api/posts       | Get all posts        |
| GET    | /api/posts/:id   | Get a single post    |
| POST   | /api/posts       | Create a new post    |
| PUT    | /api/posts/:id   | Update a post        |
| DELETE | /api/posts/:id   | Delete a post        |

### Employees

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | /api/employees            | Get employees (supports skip/take query)     |
| GET    | /api/employees/:id        | Get a single employee                        |
| GET    | /api/employees/details    | Get employee details (supports skip/take)    |
| GET    | /api/employees/:id/details| Get details for a specific employee          |

The employees endpoint returns a paginated response:
```json
{
  "data": [...],
  "total": 1000,
  "skip": 0,
  "take": 100
}
```

## WebSocket Events

### Posts Events

| Event           | Direction       | Description                          |
|-----------------|-----------------|--------------------------------------|
| posts:updated   | Server → Client | Emitted when posts are modified      |

### Config Events

| Event           | Direction       | Description                                    |
|-----------------|-----------------|------------------------------------------------|
| config:get      | Client → Server | Request current configuration                  |
| config:update   | Client → Server | Send configuration changes                     |
| config:current  | Server → Client | Sends current config (on connect or request)   |
| config:updated  | Server → Client | Broadcasts config changes to all clients       |

## Demo Config Page

The Demo Config page (`/config`) demonstrates real-time configuration synchronization across multiple clients using WebSockets.

### How It Works

1. **Initial Connection**: When a client connects, the server immediately sends the current configuration state
2. **Making Changes**: When a user modifies any setting (toggle, input field, dropdown), the change is emitted to the server via WebSocket
3. **Broadcasting Updates**: The server updates the configuration and broadcasts the new state to ALL connected clients
4. **Real-time Sync**: All browser windows/tabs instantly reflect the updated configuration without page refresh

### Configuration Options

| Option       | Type     | Description                              |
|--------------|----------|------------------------------------------|
| enabled      | boolean  | Toggle switch for enabling/disabling     |
| float_value  | number   | Decimal number input                     |
| int_value    | integer  | Whole number input                       |
| string_value | string   | Free text input                          |
| select_value | enum     | Dropdown selection                       |

### Testing Real-time Updates

1. Open the app in two or more browser windows
2. Navigate to `/config` in each window
3. Change any configuration value in one window
4. Observe the change instantly appearing in all other windows

## Project Structure

```
├── client/          # Angular frontend
├── server/          # NestJS backend
│   └── data/        # Generated mock data (git-ignored)
├── shared/          # Shared TypeScript interfaces (@blog/shared)
├── scripts/         # Python scripts for mock data generation
├── Makefile         # Build and run commands
└── README.md
```

## Employees Table

The Employees page (`/employees`) displays a data grid with 1000 employee records using AG Grid Community. The page has two tabs:

- **Employees** (`/employees`): Main employee list with core fields
- **Details** (`/employees/details`): Extended employee information

### Features

- **Virtual Scrolling**: Smooth scrolling through large datasets without pagination
- **Sortable Columns**: Click column headers to sort
- **Filterable**: Built-in column filters
- **Resizable Columns**: Drag column borders to resize
- **Row Selection**: Single row selection support

### Employee Data Fields

| Field              | Type    | Description                    |
|--------------------|---------|--------------------------------|
| id                 | number  | Unique identifier              |
| first_name         | string  | Employee first name            |
| last_name          | string  | Employee last name             |
| email              | string  | Email address                  |
| department         | string  | Department name                |
| job_title          | string  | Job title                      |
| hire_date          | string  | Date hired (YYYY-MM-DD)        |
| salary             | number  | Annual salary                  |
| status             | string  | Active/Inactive/On Leave       |
| location           | string  | Office location                |
| manager_id         | number  | ID of manager (nullable)       |
| performance_rating | number  | Rating 1-5                     |

### Performance Benchmarks

Tested on local development machine (localhost):

| Rows     | JSON Response Size | API Response Time | Notes                          |
|----------|-------------------|-------------------|--------------------------------|
| 1,000    | 0.26 MB           | ~0.02s            | Default dataset                |
| 10,000   | 2.6 MB            | ~0.05s            | Smooth virtual scrolling       |
| 50,000   | 13.3 MB           | ~0.1s             | Grid handles well              |
| 100,000  | 26.5 MB           | ~0.15s            | Slight delay on initial render |
| 200,000  | 53.3 MB           | ~1.1s             | CSV parsing dominates time     |

**Key Findings:**
- AG Grid virtual scrolling handles 200k rows smoothly after initial load
- The bottleneck is server-side CSV parsing (no caching implemented)
- JSON payload scales linearly (~267 bytes per row)
- For production, consider: server-side pagination, caching, or binary formats

## Mock Data Generation

Mock data files are auto-generated when running `make server` if they don't exist. To force regeneration:

```bash
make generate-data
```

| File                  | Script                           | Description                        |
|-----------------------|----------------------------------|------------------------------------|
| employees.csv         | scripts/generate_employees.py    | 1000 employee records (master)     |
| employee_details.csv  | scripts/generate_employees.py    | 1000 detail records (for detail view) |

### Employee Detail Fields (Master-Detail View)

| Field                        | Type    | Description                          |
|------------------------------|---------|--------------------------------------|
| employee_id                  | number  | Foreign key to employees table       |
| date_of_birth                | string  | Date of birth (YYYY-MM-DD)           |
| gender                       | string  | Male/Female/Non-binary/Prefer not to say |
| marital_status               | string  | Single/Married/Divorced/etc.         |
| dependents                   | number  | Number of dependents                 |
| nationality                  | string  | Country of citizenship               |
| ssn                          | string  | Social Security Number (masked)      |
| street_address               | string  | Street address                       |
| city                         | string  | City name                            |
| state                        | string  | State code                           |
| postal_code                  | string  | ZIP/Postal code                      |
| country                      | string  | Country                              |
| home_phone                   | string  | Home phone number                    |
| mobile_phone                 | string  | Mobile phone number                  |
| work_phone                   | string  | Work phone number                    |
| work_extension               | string  | Work phone extension                 |
| emergency_contact_name       | string  | Emergency contact full name          |
| emergency_contact_phone      | string  | Emergency contact phone              |
| emergency_contact_relationship | string | Relationship to emergency contact    |
| bank_name                    | string  | Bank name for direct deposit         |
| bank_account                 | string  | Bank account number (masked)         |
| routing_number               | string  | Bank routing number (masked)         |
| tax_id                       | string  | Tax ID (masked)                      |
| drivers_license              | string  | Driver's license number              |
| drivers_license_state        | string  | Driver's license state               |
| blood_type                   | string  | Blood type                           |
| medical_conditions           | string  | Medical conditions                   |
| allergies                    | string  | Known allergies                      |
| dietary_restrictions         | string  | Dietary restrictions                 |
| shirt_size                   | string  | Shirt size (XS-XXL)                  |
| notes                        | string  | Additional notes                     |
