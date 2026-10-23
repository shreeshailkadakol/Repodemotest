# Environment Configuration

## Azure DevOps Scripts (.env Setup)

The Azure DevOps integration scripts now use environment variables for secure configuration.

### Setup Instructions

1. **Copy the template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** with your actual values:
   ```env
   AZURE_DEVOPS_ORGANIZATION=your-organization-name
   AZURE_DEVOPS_PROJECT=your-project-name  
   AZURE_DEVOPS_PAT=your-personal-access-token
   AZURE_DEVOPS_BASE_URL=https://dev.azure.com/your-org/your-project
   ```

3. **Generate PAT Token**:
   - Go to Azure DevOps → User Settings → Personal Access Tokens
   - Create new token with "Work Items (read & write)" permissions
   - Copy the token to your .env file

### Scripts That Use .env

- `npm run fetch-requirements` - Fetches requirements from Azure DevOps
- `npm run log-bug` - Creates bugs in Azure DevOps
- `npm run bug-helper` - Interactive bug creation wizard

### Security Notes

**Safe**: `.env` file is in .gitignore and won't be committed  
**Secure**: PAT tokens are not hardcoded in source code  
**Flexible**: Easy to change environments (dev/staging/prod)  
**Important**: Never commit .env files to version control

### Testing

After setup, test with:
```bash
# Test requirements fetcher
npm run fetch-requirements 341

# Test bug logger
npm run log-bug --title="Test bug" --summary="Testing configuration"
```

Both should work without errors and show "injecting env from .env" message.