# Communication & AI Support

## Overview
This module handles direct communication between patients and doctors, as well as providing 24/7 support via an AI-powered pregnancy assistant.

## Core Features
- **Doctor-Patient Chat:** Secure, persistent messaging channel between assigned patient and doctor.
- **AI Chatbot:** Automated assistant to answer pregnancy-related questions, provide guidance on symptoms, and offer general support.
- **Notifications:** Real-time alerts for new messages.

## Data Models
### Conversation & Message
Standard chat model.
- **Conversation:** Links a `Patient` and `Doctor` uniquely (`patientId`, `doctorId`).
- **Message:** Individual text entries with `senderId`, `content`, `read` status.

### AIChatSession & AIMessage
Dedicated AI interaction history.
- **AIChatSession:** A container for an interaction context.
- **AIMessage:** Messages with roles (`USER`, `ASSISTANT`, `SYSTEM`).

## Directory Structure
- `src/app/(dashboard)/messages/`: UI for doctor-patient chat threads.
- `src/app/(dashboard)/ai-chat/`: Interface for the AI assistant.
- `prisma/schema.prisma`: Defines `Conversation`, `Message`, `AIChatSession`, `AIMessage`.
