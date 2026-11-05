# LifeLink 2.0

LifeLink 2.0 is a capstone project about making blood donation easier to coordinate. The idea is to connect people who need blood with donors and hospitals, and help manage requests and donation appointments in one place.

The planned stack is a React and Vite frontend with a Django REST Framework backend. The project context also mentions JWT login and SQLite for local development.

> **About this README:** I couldn’t see the application code in the project folder available to me. The feature list and API routes below come from the project context and earlier discussion, so please check them against your code before submitting. I’ve left out setup commands and configuration names that I couldn’t verify.

## What the project aims to do

- Let people submit and follow blood requests.
- Give donors a profile and a way to find relevant requests.
- Let donors arrange appointments with hospitals.
- Help hospitals manage requests and blood inventory.
- Support notifications and basic activity analytics.
- Provide different access for donors, requesters, hospitals, and administrators.

These are project goals; I couldn’t confirm which ones are already implemented.

## User roles

- **Donors** can have a donor profile and take part in donation appointments.
- **Requesters** can submit or follow a blood request.
- **Hospitals** can coordinate requests and appointments, and may manage inventory.
- **Administrators** can manage platform records, depending on the permissions in the application.

The exact actions each role can take depend on the permissions implemented in the backend.

## How it is organized

The intended setup has a web frontend talking to a REST API:

```text
React + Vite frontend  →  Django REST Framework API  →  SQLite locally
```

JWT is the stated authentication method. The actual token settings, database configuration, and production setup still need to be checked in the code.

## Features and current status

The project context includes blood requests, donor profiles, hospital workflows, appointments, inventory, donor matching, notifications, analytics, and role-based access. I couldn’t mark these as implemented or tested because the application files and tests weren’t available in the folder I inspected.

## Installation and running locally

I can’t give reliable run commands yet: the available folder didn’t include the frontend or backend code, package files, Python dependency list, or Django settings. Check those files in your actual project to find the correct install and start commands, required configuration, and local addresses. Add the verified commands here so someone else can run the project without guessing.

SQLite is mentioned for local development, but its path and setup are not confirmed. Don’t add secret keys or passwords to the repository.

## API notes

These routes were mentioned in an earlier discussion. Please check the Django URL configuration and views to confirm they exist, which HTTP methods they support, and which users can access them.

| Route mentioned | Possible purpose |
| --- | --- |
| `/api/register/` | Create an account |
| `/api/token/` | Log in and get JWT tokens |
| `/api/donors/me/` | View the current donor profile |
| `/api/blood-requests/` | View blood requests |
| `/api/appointments/` | View or book appointments |
| `/api/appointments/{id}/approve/` | Approve an appointment |
| `/api/appointments/{id}/reject/` | Reject an appointment |

An earlier appointment error listed `donor`, `blood_request`, `hospital`, and `appointment_date` as required fields. Confirm the appointment serializer before using those names in Postman. The supported method for editing a blood request also needs to be checked in the backend.

## Trying the API in Postman

Once the backend is running, use Postman to try the routes that are confirmed in the code:

1. Register a test account.
2. Log in and copy the token returned by the API.
3. Use the token when calling a route that requires authentication.
4. Check the profile and role returned for that account.
5. Try the blood request and appointment workflows with test data.
6. Sign in with a hospital account to check the hospital-side actions.

Use the exact request fields from the serializers. Use IDs returned by your own API responses, and keep tokens, passwords, and real donor or patient information out of shared Postman collections.

## Security

Before using real accounts or personal information, check that the backend verifies permissions for every protected action. In particular, a donor should not be able to create an appointment using another donor’s identity. Keep signing secrets and passwords private, and use HTTPS and an appropriate production database if the project is deployed.

These are checks to make against the implementation, not claims that they have already been completed.

## Testing and contributions

I couldn’t find test files or test commands in the available project folder. Once the source is available, add the project’s actual test instructions here. Changes to login, permissions, blood requests, matching, and appointments should be checked for both successful and rejected requests.

When contributing, describe what changed and how you checked it. Use test data, and don’t commit credentials or real donor and patient details.

## Next steps

The most useful next step is to compare this README with the actual frontend and backend, then fill in the verified install steps, endpoint behavior, and test commands. The project’s matching, inventory, notification, and analytics features should also be labelled as implemented or planned based on the code.

