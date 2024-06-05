import { Team } from "../domain/team";

export function fromApiTeam(apiTeam: Team): Team {
    return {
        name: apiTeam.name,
        crest: apiTeam.crest,
    };
}
