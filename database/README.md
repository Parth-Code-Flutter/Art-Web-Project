# Database Setup & Migrations

This folder contains all SQL scripts for setting up and maintaining the Supabase database.

## Folder Structure

- **`setup/`** - Initial database setup scripts
- **`migrations/`** - Database migration scripts (future use)

## Setup Scripts

### Core Tables
- `supabase_customers.sql` - Customer table schema
- `supabase_admins.sql` - Admin table schema
- `supabase_orders.sql` - Orders table schema
- `shipping_schema.sql` - Shipping information schema

### Access Control & Policies
- `add_parth_as_admin.sql` - Add specific admin user
- `check_admin_access.sql` - Verify admin access
- `comprehensive_admin_fix.sql` - Complete admin setup fix
- `fix_admin_access.sql` - Fix admin access issues
- `fix_orders_policy.sql` - Fix orders RLS policies

### Triggers & Automation
- `registration_trigger.sql` - **IMPORTANT**: Auto-create customer/seller profiles on signup

## How to Use

1. **Initial Setup**: Run scripts in the following order:
   ```
   1. supabase_customers.sql
   2. supabase_admins.sql
   3. supabase_orders.sql
   4. shipping_schema.sql
   5. registration_trigger.sql (CRITICAL for auth flow)
   ```

2. **Access Supabase Dashboard**:
   - Go to your project dashboard
   - Navigate to SQL Editor
   - Copy and paste the script content
   - Click "Run"

3. **Verify Setup**:
   - Use `check_admin_access.sql` to verify admin permissions
   - Test registration flow to ensure trigger works

## Important Notes

- **Always backup** your database before running migration scripts
- Test scripts in a development environment first
- The `registration_trigger.sql` is **required** for the authentication flow to work properly
- RLS (Row Level Security) policies are critical for data security

## Troubleshooting

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify RLS policies are correctly set
3. Ensure triggers are active
4. Run the relevant fix scripts from the setup folder
