# NFL Stats Dashboard 🏈

![NFL Stats Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)  
A full-stack web application to explore NFL player statistics, rankings, and salaries, featuring secure user authentication, interactive data visualizations, and a robust data pipeline.

## Overview

The **NFL Stats Dashboard** is a full-stack web app designed to provide NFL enthusiasts and analysts with a comprehensive platform to view player statistics, rankings, and salaries. Built with a Node.js backend and React frontend, the app integrates an external NFL Stats API, stores data in a Neon PostgreSQL database, and includes Python-powered data visualizations and web scraping for enhanced functionality. Users can log in securely, edit their profiles, and explore player data through an interactive dashboard.

This project showcases my skills in full-stack development, API integration, data visualization, and secure authentication, making it a key part of my portfolio as a software engineering enthusiast.

## Features

- **Interactive Dashboard**: View NFL player stats and rankings through a user-friendly interface built with React.
- **Secure Authentication**: Log in and edit your profile with JWT and bcrypt for secure user management.
- **Data Visualizations**: Explore player rankings with Python-generated charts using Matplotlib.
- **External API Integration**: Fetch real-time NFL player stats using an external NFL Stats API, with data migrated to a Neon PostgreSQL database.
- **Web Scraping & REST API**: Scrape NFL player salaries using Python (`BeautifulSoup`, `requests`) and serve the data via a custom REST API built with Node.js.
- **Structured Data Storage**: Store and manage player data efficiently in a Neon PostgreSQL database.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Neon)
- **Data Processing**:
  - Python
  - Matplotlib (for data visualizations)
  - BeautifulSoup & requests (for web scraping)
- **Security**: JWT, bcrypt
- **Languages**: JavaScript, Python

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [PostgreSQL](https://www.postgresql.org/) (or use [Neon](https://neon.tech/) for a serverless database)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AtxAppBuilder/NFL-Stats.git
   cd NFL-Stats
