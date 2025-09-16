# API Key Encryption Implementation

## Overview

This application implements client-side encryption for sensitive API keys before transmission to the backend server.

## Security Features

### 🔐 AES-256 Encryption

- All API keys are encrypted using AES-256 encryption
- Encryption happens on the client-side before sending to the server
- Each encrypted value includes a timestamp salt for additional security

### 🔑 Encrypted Fields

The following fields are automatically encrypted:

- `openai_api_key` - OpenAI API keys
- `bot_api_key` - Bot integration API keys
- `api_key` - General purpose API keys

### 🛡️ Validation

- OpenAI keys must start with 'sk-' and be > 20 characters
- Bot API keys must be > 10 characters
- General API keys must be > 5 characters

### 🌍 Environment Configuration

Encryption key is configured via environment variables:

```env
VITE_ENCRYPTION_KEY=your-secret-encryption-key
```

## Implementation Details

### Client-Side Encryption

```javascript
// Automatic encryption in API calls
const encryptedData = encryptClientData(clientData);
API.post("/clients", encryptedData);
```

### Encryption Process

1. Validate API key format
2. Add timestamp salt to data
3. Encrypt with AES-256
4. Send encrypted data to backend

### Backend Requirements

Your backend should:

1. Decrypt the received API keys using the same encryption key
2. Store decrypted keys securely (recommended: additional server-side encryption)
3. Never log or expose decrypted keys in responses

## Security Best Practices

### Production Deployment

- Use strong, unique encryption keys in production
- Store encryption keys in secure environment variables
- Rotate encryption keys periodically
- Monitor for encryption/decryption errors

### Key Management

- Never commit encryption keys to version control
- Use different keys for development and production
- Consider using a key management service for production

## Files Modified

- `src/services/api.js` - Added encryption utilities and modified client API calls
- `src/components/clientForm.jsx` - Added security notices and updated helper text
- `.env` - Added encryption key configuration

## Dependencies

- `crypto-js` - For AES encryption functionality
