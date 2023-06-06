import { ProviderType } from 'src/enum/provider.type';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('oauth')
export class OAuth {
  @PrimaryColumn({
    type: 'int',
    name: 'user_id',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'oauth_id',
    length: 255,
  })
  oauthId: string;

  @Column({
    type: 'varchar',
    name: 'access_token',
    length: 255,
  })
  accessToken: string;

  @Column({
    type: 'enum',
    name: 'provider',
    enum: ProviderType,
  })
  provider: ProviderType;
}
