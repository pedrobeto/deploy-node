import User from "@modules/users/infra/typeorm/entities/User";

export default class UserMap {
    public static toDTO(user: User) {
      return {
        name: user.name,
        email: user.email,
        id: user.id,
        avatar: user.avatar,
        created_at: user.created_at,
        updated_at: user.updated_at 
      };
    }
  }
  