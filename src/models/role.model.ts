import rolesData from '../config/roles.json';

export class Role {
    private roles: typeof rolesData.roles;

    constructor() {
        this.roles = rolesData.roles;
    }

    getRoleByName(name: string) {
        return this.roles.find(role => role.name === name);
    }

    getRoles() {
        return this.roles;
    }
}