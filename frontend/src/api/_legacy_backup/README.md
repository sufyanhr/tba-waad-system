# Legacy Template API Files

This folder contains the original Mantis React template mock API files that are no longer actively used in the TBA-Waad production system.

These files are preserved for reference only.

## Status: ARCHIVED

DO NOT import from these files in new code.

## Domain Mapping Reference:

| Template Module | TBA Domain | New Location |
|----------------|------------|--------------|
| products | Medical Services | `services/api/medicalServicesService.js` |
| customer | Members | `services/api/membersService.js` |
| kanban | Providers Board | `services/api/providersService.js` |
| applications | Claims/Approvals | `services/api/claimsService.js` |

## Template Files Kept for UI Compatibility:

- `chat.js` - Internal office chat (will be refactored)
- `invoice.js` - Billing module (future integration)
- `cart.js` - Not used in TPA context
- `address.js`, `calender.js` - Utility APIs

Last Updated: 2025-11-23
