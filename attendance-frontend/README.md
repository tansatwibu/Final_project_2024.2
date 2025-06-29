# Attendance Management System

This project is a web application built with Next.js for managing attendance, shifts, employees, and production logs. It provides a user-friendly interface for administrators to oversee various aspects of attendance management.

## Project Structure

The project is organized into the following main directories:

- **public/**: Contains static assets such as images and icons.
- **src/**: Contains the main application code.
  - **components/**: Reusable components used throughout the application.
    - `Header.js`: Renders the header of the application, including the title and navigation links.
    - `Sidebar.js`: Provides a sidebar navigation menu for easy access to different sections of the application.
    - `OverviewCard.js`: Displays key metrics or summaries related to employees, shifts, products, or attendance.
    - `EmployeeTable.js`: Renders a table displaying employee data, allowing for viewing and management of employee records.
    - `ShiftTable.js`: Displays a table of shifts, including details such as shift times and assigned employees.
    - `ProductTable.js`: Renders a table showing product information, including names and codes.
    - `AttendanceLog.js`: Displays attendance logs for employees, showing their check-in and check-out times.
    - `ProductionLog.js`: Shows logs of production activities, including details about products produced and associated employees.
    - `AlertList.js`: Displays a list of alerts related to attendance or production issues.
  - **pages/**: Contains the application's pages.
    - `_app.js`: Custom App component that initializes pages.
    - `_document.js`: Used to augment the application's HTML document structure.
    - `index.js`: Main landing page of the application.
    - `employees.js`: Employee management interface.
    - `shifts.js`: Shift management interface.
    - `products.js`: Product management interface.
    - `attendance.js`: Attendance logs interface.
    - `production.js`: Production logs interface.
    - `api/hello.js`: Example API route for testing.
  - **styles/**: Contains CSS files for styling the application.
    - `globals.css`: Global styles for the application.
    - `Home.module.css`: Styles specific to the Home component.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd attendance-frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Features

- Employee management with the ability to view, add, update, and delete employee records.
- Shift management to oversee shift schedules and assignments.
- Product management for tracking products and their details.
- Attendance logging to monitor employee attendance.
- Production logging to keep track of production activities.
- Real-time alerts for attendance and production issues.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.