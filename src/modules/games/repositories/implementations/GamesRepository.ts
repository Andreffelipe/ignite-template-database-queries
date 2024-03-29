import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const game = await this.repository
      .createQueryBuilder()
      .where(`title ILIKE '%${param}%'`)
      .getMany()
    return game;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT count(id) FROM games;"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const user = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where("games.id = :id", { id })
      .getMany();
    return user[0].users;
  }
}
