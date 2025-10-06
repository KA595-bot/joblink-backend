import rolesData from '@/config/roles.json';

export class Permissions {
    getPermissionsByRoleName(roleName: string): string[] {
        const role = rolesData.roles.find(r => r.name === roleName);
        if (!role) {
            console.log(`Role '${roleName}' not found in roles.json`);
            return [];
        }
        return role.permissions;
    }
}